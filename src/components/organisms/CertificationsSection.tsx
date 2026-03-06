'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Copy, CheckCheck, Award, ShieldCheck, Calendar } from 'lucide-react'
import { GlowCard } from '@/components/atoms/GlowCard'
import { Badge } from '@/components/atoms/Badge'
import { fadeUp } from '@/lib/utils/animations'
import resumeData from '@/lib/data/resume.json'

function CertCard({
  cert,
  index,
}: {
  cert: (typeof resumeData.certifications)[0]
  index: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!cert.certificate_id) return
    await navigator.clipboard.writeText(cert.certificate_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlowCard className="p-4 sm:p-6 h-full flex flex-col gap-4 hover:border-accent/40 transition-colors">

        {/* ── Header row ── */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 sm:w-7 sm:h-7 text-accent" />
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3
                  className="font-space font-bold text-text-primary leading-tight"
                  style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)' }}
                >
                  {cert.title}
                </h3>
                <p className="text-accent text-sm font-semibold mt-0.5 truncate">
                  {cert.issuer}
                </p>
              </div>
              {/* Year badge — always visible */}
              <Badge variant="neutral" className="font-mono text-xs flex-shrink-0">
                <Calendar className="w-3 h-3 mr-1" />
                {cert.year}
              </Badge>
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        <p className="text-text-muted text-sm leading-relaxed flex-1">
          {cert.description}
        </p>

        {/* ── Certificate ID box ── */}
        {cert.certificate_id && (
          <div className="rounded-xl bg-surface-2 border border-border p-3">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
              Certificate ID
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <code
                className="text-accent font-mono flex-1 min-w-0 truncate"
                style={{ fontSize: 'clamp(9px, 2vw, 12px)' }}
                title={cert.certificate_id}
              >
                {cert.certificate_id}
              </code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                aria-label="Copy certificate ID"
              >
                {copied
                  ? <CheckCheck className="w-4 h-4 text-success" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Verify link ── */}
        <a
          href={cert.verify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors group self-start"
          aria-label={`Verify ${cert.title} certificate`}
        >
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          Verify Certificate
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </GlowCard>
    </motion.div>
  )
}

export function CertificationsSection() {
  return (
    <section
      id="certifications"
      className="section-padding"
      aria-label="Certifications section"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2
            className="font-space font-black text-text-primary"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            Certifications
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
        </motion.div>

        {/* ── Cards grid ──
              Mobile  : 1 column (full width)
              Tablet+ : 2 columns
              Max width centered                    ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {resumeData.certifications.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
