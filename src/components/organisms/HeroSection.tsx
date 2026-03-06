'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowDown, Download, Mail, Github, Linkedin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { AnimatedCounter } from '@/components/atoms/AnimatedCounter'
import resumeData from '@/lib/data/resume.json'

const EarthGlobe = dynamic(
  () => import('@/components/three/EarthGlobe').then(m => m.EarthGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    ),
  }
)

const stats = [
  { value: 3,   suffix: '+', label: 'Years'   },
  { value: 6,   suffix: '',  label: 'Projects' },
  { value: 2,   suffix: '',  label: 'Certs'    },
  { value: 300, suffix: '+', label: 'Users'    },
]

export function HeroSection() {
  const heroRef  = useRef<HTMLElement>(null)
  const nameRef  = useRef<HTMLHeadingElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const tagRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef   = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (nameRef.current) {
        const text = nameRef.current.textContent || ''
        nameRef.current.innerHTML = ''
        const chars = text.split('').map(char => {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00A0' : char
          span.style.opacity = '0'
          span.style.display = 'inline-block'
          span.style.transform = 'translateY(20px)'
          nameRef.current!.appendChild(span)
          return span
        })
        const cursor = document.createElement('span')
        cursor.className = 'cursor-blink'
        nameRef.current.appendChild(cursor)
        tl.to(chars,  { opacity: 1, y: 0, duration: 0.04, stagger: 0.05 })
          .to(cursor, { opacity: 0, duration: 0.3, repeat: 3, yoyo: true }, '-=0.2')
          .to(cursor, { display: 'none' })
      }

      tl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(tagRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(ctaRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-start hero-bg"
      aria-label="Hero section"
    >
      <div className="hero-grid" aria-hidden="true" />

      {/* Glow blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.3) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 pb-16 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-2 lg:gap-6 items-center w-full">

          {/* ══════════════════════════════════════════
              GLOBE — order-1 on mobile (top)
                      order-2 on desktop (right)
              ══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="order-1 lg:order-2 relative w-full"
            aria-hidden="true"
            style={{
              /* ✅ 320px min on tiny phones, 80vw on mid phones, 560px max on desktop */
              height: 'clamp(320px, 80vw, 560px)',
            }}
          >
            {/* Glow behind globe */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 30%, transparent 70%)' }}
            />

            <EarthGlobe />

            {/* Floating label */}
            <motion.div
              className="absolute bottom-2 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <p
                className="text-text-muted font-mono uppercase tracking-widest bg-surface/70 px-2.5 py-1 rounded-full border border-border backdrop-blur-sm whitespace-nowrap"
                style={{ fontSize: 'clamp(7px, 1.8vw, 10px)' }}
              >
                🟡 Bhopal, India — Online
              </p>
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════
              TEXT — order-2 on mobile (below globe)
                     order-1 on desktop (left)
              ══════════════════════════════════════════ */}
          <div className="flex flex-col justify-center order-2 lg:order-1">

            {resumeData.meta.open_to_work && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <Badge variant="success" dot className="text-xs sm:text-sm px-3 py-1">
                  Open to Work
                </Badge>
              </motion.div>
            )}

            {/* Name */}
            <h1
              ref={nameRef}
              className="font-space font-black text-text-primary leading-none mb-3"
              style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}
              aria-label={resumeData.meta.name}
            >
              {resumeData.meta.name}
            </h1>

            {/* Title */}
            <p
              ref={titleRef}
              className="font-space font-semibold mb-3"
              style={{ fontSize: 'clamp(0.9rem, 2.8vw, 1.75rem)', opacity: 0 }}
            >
              <span className="gradient-text">{resumeData.meta.title}</span>
            </p>

            {/* Tagline — hidden on small phones to save space */}
            <p
              ref={tagRef}
              className="hidden sm:block text-text-secondary max-w-xl mb-5 leading-relaxed italic"
              style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', opacity: 0 }}
            >
              &ldquo;{resumeData.meta.tagline}&rdquo;
            </p>

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-2 sm:gap-3 mb-5"
              style={{ opacity: 0 }}
            >
              <a href={resumeData.meta.resume_url} download="Kapil_Meena_Resume.pdf">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Download className="w-4 h-4" />}
                  iconPosition="left"
                  glow
                >
                  Resume
                </Button>
              </a>
              <a href="#contact">
                <Button
                  variant="outline"
                  size="lg"
                  icon={<Mail className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Let&apos;s Talk
                </Button>
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 mb-6">
              {[
                { href: resumeData.meta.github,   icon: <Github className="w-4 h-4 sm:w-5 sm:h-5" />,       label: 'GitHub'   },
                { href: resumeData.meta.linkedin, icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,     label: 'LinkedIn' },
                { href: resumeData.meta.codolio,  icon: <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />, label: 'Codolio'  },
              ].map(({ href, icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                  aria-label={label}
                >
                  {icon}
                </motion.a>
              ))}
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-4 gap-2"
              style={{ opacity: 0 }}
            >
              {stats.map(({ value, suffix, label }) => (
                <div
                  key={label}
                  className="text-center p-2 sm:p-3 rounded-xl bg-surface/50 border border-border hover:border-accent/40 transition-colors"
                >
                  <div
                    className="font-black font-space gradient-text"
                    style={{ fontSize: 'clamp(0.9rem, 3vw, 1.6rem)' }}
                  >
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div
                    className="text-text-muted mt-0.5"
                    style={{ fontSize: 'clamp(8px, 1.8vw, 11px)' }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50"
        aria-hidden="true"
      >
        <span className="text-text-muted font-mono uppercase tracking-widest" style={{ fontSize: '9px' }}>
          Scroll
        </span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="w-4 h-4 text-accent" />
        </motion.div>
      </div>
    </section>
  )
}
