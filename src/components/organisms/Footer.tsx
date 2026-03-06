'use client'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ExternalLink, ArrowUp } from 'lucide-react'
import resumeData from '@/lib/data/resume.json'

const socialLinks = [
  { icon: <Github className="w-5 h-5" />, href: resumeData.meta.github, label: 'GitHub' },
  { icon: <Linkedin className="w-5 h-5" />, href: resumeData.meta.linkedin, label: 'LinkedIn' },
  { icon: <Mail className="w-5 h-5" />, href: `mailto:${resumeData.meta.email}`, label: 'Email' },
  { icon: <ExternalLink className="w-5 h-5" />, href: resumeData.meta.codolio, label: 'Codolio' },
]

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      className="relative border-t border-border bg-surface/50"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="font-space font-black text-accent text-sm">KM</span>
            </div>
            <div>
              <p className="font-space font-bold text-text-primary text-sm">Kapil Meena</p>
              <p className="text-text-muted text-xs">Full-Stack Developer & Cybersecurity Engineer</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                aria-label={label}
              >
                {icon}
              </motion.a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <a
              href="/privacy"
              className="hover:text-accent transition-colors"
            >
              Privacy
            </a>
            <span aria-hidden="true">•</span>
            <p>© {new Date().getFullYear()} Kapil Meena</p>
            <span aria-hidden="true">•</span>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              Top
            </motion.button>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            Built with Next.js 14, TypeScript, Three.js, Framer Motion & GSAP.
            Designed & developed by Kapil Meena.
          </p>
        </div>
      </div>
    </footer>
  )
}
