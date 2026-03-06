import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'

/* ── Validation schema ──────────────────────────────────────── */
const schema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().max(200).trim(),
  subject: z.string().min(5).max(200).trim(),
  message: z.string().min(20).max(5000).trim(),
})

/* ── Rate limiter ───────────────────────────────────────────── */
const rateMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now    = Date.now()
  const window = 60_000
  const limit  = 3
  const prev   = (rateMap.get(ip) || []).filter(t => now - t < window)
  if (prev.length >= limit) return true
  rateMap.set(ip, [...prev, now])
  return false
}

/* ── Email HTML template (sent to YOU only) ─────────────────── */
function buildHTML(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050d1a; color: #E8F0FE; font-family: system-ui, sans-serif; }
        .wrap  { max-width: 580px; margin: 0 auto; padding: 32px 16px; }
        .card  { background: #0a1628; border: 1px solid #1A2E4A; border-radius: 16px; overflow: hidden; }
        .header{ background: linear-gradient(135deg,#00D4FF22,#7B5EA722); padding: 28px 28px 20px; border-bottom: 1px solid #1A2E4A; }
        .header h1 { font-size: 20px; font-weight: 800; color: #00D4FF; }
        .header p  { color: #8BA3C7; font-size: 13px; margin-top: 4px; }
        .body  { padding: 24px 28px; }
        .field { margin-bottom: 18px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #4A6080; margin-bottom: 5px; }
        .value { font-size: 14px; color: #E8F0FE; line-height: 1.6; }
        .msg   { background: #111e35; border: 1px solid #1A2E4A; border-radius: 10px; padding: 14px; white-space: pre-wrap; }
        .reply { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00D4FF; color: #050d1a; font-weight: 700; font-size: 14px; border-radius: 10px; text-decoration: none; }
        .footer{ padding: 16px 28px; border-top: 1px solid #1A2E4A; font-size: 11px; color: #4A6080; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="card">
          <div class="header">
            <h1>📬 New Portfolio Message</h1>
            <p>Someone reached out via your contact form</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${name} &lt;${email}&gt;</div>
            </div>
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="value msg">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="reply">
              ↩ Reply to ${name}
            </a>
          </div>
          <div class="footer">
            Sent from kapilmeena.dev · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/* ── POST handler ───────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    /* Rate limit */
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests — please wait a minute.' },
        { status: 429 },
      )
    }

    /* Parse + validate */
    const raw = await req.json().catch(() => null)
    if (!raw) {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data.', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { name, email, subject, message } = parsed.data

    /* Check env */
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[contact] SMTP env vars not set')
      return NextResponse.json(
        { error: 'Email service not configured.' },
        { status: 503 },
      )
    }

    /* Send email to YOU only — no auto-reply to user */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `[Portfolio] ${subject}`,
      html:    buildHTML(name, email, subject, message),
      text:    `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    console.error('[contact] Error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    )
  }
}

/* ── Block GET ──────────────────────────────────────────────── */
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
}
