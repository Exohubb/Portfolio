'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, ArrowRight, Zap } from 'lucide-react'
import { ProjectCard } from '@/components/molecules/ProjectCard'
import { Badge } from '@/components/atoms/Badge'
import { fadeUp } from '@/lib/utils/animations'
import resumeData from '@/lib/data/resume.json'
import type { Project } from '@/types/resume'

export function ProjectsGrid() {
  const [selected, setSelected] = useState<Project | null>(null)
  const projects = resumeData.projects as Project[]

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <section id="projects" className="section-padding" aria-label="Projects section">
      <div className="max-w-7xl mx-auto">

        {/* ── Heading ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2
            className="font-space font-black text-text-primary"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            Projects
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
          <p className="mt-4 text-text-secondary text-sm max-w-xl mx-auto px-2">
            Building real-world systems across full-stack development, systems engineering, and cybersecurity.
          </p>
        </motion.div>

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          PROJECT DETAIL MODAL — fully responsive
          ════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <>
            {/* ── Backdrop ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* ── Modal sheet ──
                  Mobile  : full screen bottom sheet (slides up)
                  Tablet+ : centered floating card             ── */}
            <motion.div
              key={selected.id}
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              className={[
                'fixed z-50 bg-[var(--color-surface)] border border-[var(--color-border)]',
                'flex flex-col overflow-hidden',
                // Mobile: full width, anchored to bottom, max 92vh
                'inset-x-0 bottom-0 rounded-t-3xl',
                'sm:inset-x-auto sm:left-1/2 sm:bottom-auto sm:top-1/2',
                'sm:-translate-x-1/2 sm:-translate-y-1/2',
                'sm:w-[92vw] sm:max-w-2xl sm:rounded-2xl',
                'sm:max-h-[90vh]',
              ].join(' ')}
              style={{ maxHeight: '92vh' }}
              initial={{
                // Mobile slides up; desktop scales in
                y: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 40,
                opacity: 0,
                scale: typeof window !== 'undefined' && window.innerWidth >= 640 ? 0.94 : 1,
              }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{
                y: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 40,
                opacity: 0,
                scale: typeof window !== 'undefined' && window.innerWidth >= 640 ? 0.94 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Drag handle — visible on mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden="true">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* ── Scrollable content ── */}
              <div className="overflow-y-auto flex-1 px-4 sm:px-8 py-4 sm:py-7">

                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors z-10"
                  aria-label="Close project details"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* ── Project icon + title ── */}
                <div className="flex items-start gap-4 mb-5 pr-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {selected.highlight && (
                      <Badge variant="featured" dot className="mb-2 text-xs">
                        Featured Project
                      </Badge>
                    )}
                    <h3
                      className="font-space font-black text-text-primary leading-tight"
                      style={{ fontSize: 'clamp(1.15rem, 4vw, 1.75rem)' }}
                    >
                      {selected.title}
                    </h3>
                    <p className="text-text-secondary text-sm mt-0.5">
                      {selected.subtitle}
                    </p>
                    <p className="text-text-muted text-xs mt-1 font-mono">
                      {selected.duration}
                    </p>
                  </div>
                </div>

                {/* ── Metrics ── */}
                {selected.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {selected.metrics.map(m => (
                      <Badge key={m} variant="accent" className="text-xs">{m}</Badge>
                    ))}
                  </div>
                )}

                {/* ── Description ── */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    About
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                {/* ── Tech Stack ── */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.stack.map(tech => (
                      <span
                        key={tech}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-2 text-accent border border-accent/20 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="flex flex-col sm:flex-row gap-3 pb-2">
                  {selected.live_url && (
                    <motion.a
                      href={selected.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-primary font-semibold text-sm hover:bg-accent-hover transition-colors shadow-glow-sm w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      Live Demo
                    </motion.a>
                  )}
                  {selected.github_url && (
                    <motion.a
                      href={selected.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-2 text-text-primary font-semibold text-sm border border-border hover:border-accent/40 hover:text-accent transition-colors w-full sm:w-auto"
                    >
                      <Github className="w-4 h-4 flex-shrink-0" />
                      View Code
                    </motion.a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-2 text-text-muted text-sm border border-border hover:border-accent/40 hover:text-accent transition-colors w-full sm:w-auto sm:ml-auto"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180 flex-shrink-0" />
                    Close
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
