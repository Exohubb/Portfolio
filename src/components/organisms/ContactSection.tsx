'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Mail, Phone, Linkedin, Github,
  Copy, CheckCheck, Send, ExternalLink,
} from 'lucide-react'
import { Button }   from '@/components/atoms/Button'
import { GlowCard } from '@/components/atoms/GlowCard'
import { fadeUp, slideInLeft } from '@/lib/utils/animations'
import { cn } from '@/lib/utils/cn'
import resumeData from '@/lib/data/resume.json'

/* ── Form schema ─────────────────────────────────────────────── */
const schema = z.object({
  name:    z.string().min(2,  'At least 2 characters'),
  email:   z.string().email('Enter a valid email'),
  subject: z.string().min(5,  'At least 5 characters'),
  message: z.string().min(20, 'At least 20 characters'),
  website: z.string().max(0,  'Bot detected'),   // honeypot
})
type FormData   = z.infer<typeof schema>
type FormStatus = 'idle' | 'loading' | 'success' | 'error'

/* ── Contact link data ───────────────────────────────────────── */
const CONTACT_LINKS = [
  {
    icon:     <Mail className="w-4 h-4" />,
    label:    'Email',
    value:    resumeData.meta.email,
    href:     `mailto:${resumeData.meta.email}`,
    copyable: true,
    external: false,
  },
  {
    icon:     <Phone className="w-4 h-4" />,
    label:    'Phone',
    value:    resumeData.meta.phone,
    href:     `tel:${resumeData.meta.phone}`,
    copyable: true,
    external: false,
  },
  {
    icon:     <Linkedin className="w-4 h-4" />,
    label:    'LinkedIn',
    value:    'linkedin.com/in/kapil-meena',
    href:     resumeData.meta.linkedin,
    copyable: false,
    external: true,
  },
  {
    icon:     <Github className="w-4 h-4" />,
    label:    'GitHub',
    value:    'github.com/kapilmeena',
    href:     resumeData.meta.github,
    copyable: false,
    external: true,
  },
  {
    icon:     <span className="font-bold font-mono text-xs">C</span>,
    label:    'Codolio',
    value:    'codolio.com/kapilmeena',
    href:     resumeData.meta.codolio,
    copyable: false,
    external: true,
  },
]

/* ── Single contact row ──────────────────────────────────────── */
function ContactRow({
  icon, label, value, href, copyable, external,
}: typeof CONTACT_LINKS[0]) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-surface-2 border border-border hover:border-accent/40 transition-colors group min-w-0">
      {/* Icon */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-sm text-text-primary hover:text-accent transition-colors font-mono truncate block"
          title={value}
        >
          {value}
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {external && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label={`Visit ${label}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label={`Copy ${label}`}
          >
            {copied
              ? <CheckCheck className="w-3.5 h-3.5 text-success" />
              : <Copy       className="w-3.5 h-3.5" />
            }
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Input field wrapper ─────────────────────────────────────── */
function Field({
  id, label, error, required = false, children,
}: {
  id:       string
  label:    string
  error?:   string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-text-secondary mb-1.5">
        {label}{required && <span className="text-error ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-error text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (hasError: boolean) =>
  cn(
    'w-full px-4 py-3 rounded-xl bg-surface-2 border text-text-primary text-sm',
    'placeholder:text-text-muted transition-colors focus:outline-none focus:border-accent',
    hasError ? 'border-error' : 'border-border',
  )

/* ── Main section ────────────────────────────────────────────── */
export function ContactSection() {
  const [status,   setStatus]   = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')         // ✅ top-level state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  /* ── Submit handler ── */
  const onSubmit = async (data: FormData) => {
    if (data.website) return                           // honeypot
    setStatus('loading')
    setErrorMsg('')

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    data.name,
          email:   data.email,
          subject: data.subject,
          message: data.message,
        }),
      })
      const json = await res.json()

      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setErrorMsg(json.error || 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error — please try again.')
      setStatus('error')
    }

    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <section id="contact" className="section-padding" aria-label="Contact section">
      <div className="max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2
            className="font-space font-black text-text-primary"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            Let&apos;s Build Together
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
          <p className="mt-5 text-text-secondary text-sm sm:text-base max-w-xl mx-auto px-2">
            Whether you have a project, a security audit, or just want to connect —
            my inbox is always open.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── Left: Contact details ── */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className="font-space font-bold text-text-primary mb-5"
              style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
            >
              Contact Details
            </h3>

            <div className="flex flex-col gap-2 sm:gap-3">
              {CONTACT_LINKS.map(link => (
                <ContactRow key={link.label} {...link} />
              ))}
            </div>

            <GlowCard className="mt-5 p-4 sm:p-5">
              <p className="text-sm text-text-secondary leading-relaxed">
                📍 <span className="text-accent font-semibold">Bhopal, India</span> ·
                Available for remote work worldwide. Response time:{' '}
                <span className="text-accent font-semibold">within 24 hours</span>.
              </p>
            </GlowCard>
          </motion.div>

          {/* ── Right: Contact form ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlowCard className="p-4 sm:p-8">
              <h3
                className="font-space font-bold text-text-primary mb-5"
                style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
              >
                Send a Message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>

                {/* Honeypot */}
                <input
                  {...register('website')}
                  type="text"
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <Field id="name" label="Name" required error={errors.name?.message}>
                    <input
                      {...register('name')}
                      id="name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      className={inputClass(!!errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                  </Field>

                  <Field id="email" label="Email" required error={errors.email?.message}>
                    <input
                      {...register('email')}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClass(!!errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <Field id="subject" label="Subject" required error={errors.subject?.message}>
                    <input
                      {...register('subject')}
                      id="subject"
                      type="text"
                      placeholder="What's this about?"
                      className={inputClass(!!errors.subject)}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      aria-invalid={!!errors.subject}
                    />
                  </Field>
                </div>

                {/* Message */}
                <div className="mb-5 sm:mb-6">
                  <Field id="message" label="Message" required error={errors.message?.message}>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={5}
                      placeholder="Write your message here…"
                      className={cn(inputClass(!!errors.message), 'resize-none')}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      aria-invalid={!!errors.message}
                    />
                  </Field>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={status === 'loading'}
                  icon={<Send className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full justify-center"
                  glow
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </Button>

                {/* ✅ Success toast */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm text-center"
                    role="alert"
                    aria-live="polite"
                  >
                    ✅ Message sent! I&apos;ll reply within 24 hours.
                  </motion.div>
                )}

                {/* ✅ Error toast — shows real API error */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center"
                    role="alert"
                    aria-live="polite"
                  >
                    ❌ {errorMsg || 'Something went wrong. Please try again.'}
                  </motion.div>
                )}

              </form>
            </GlowCard>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
