'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react'
import { GlowCard } from '@/components/atoms/GlowCard'
import { fadeUp } from '@/lib/utils/animations'
import resumeData from '@/lib/data/resume.json'

export function ExperienceSection() {
  return (
    <section id="experience" className="section-padding" aria-label="Experience section">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
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
            Experience
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-5 sm:gap-8">
          {resumeData.experience.map((exp, i) => (
            <ExperienceCard key={i} exp={exp} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof resumeData.experience)[0]
  index: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const isActive = exp.duration.toLowerCase().includes('present')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlowCard className="p-4 sm:p-7 hover:border-accent/40 transition-colors">

        {/* ── TOP: icon + role block + active dot ── */}
        <div className="flex items-start gap-3 mb-3">

          {/* Icon — smaller on mobile */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>

          {/* Role + org — full width, no date crowding it */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-space font-bold text-text-primary leading-snug"
                style={{ fontSize: 'clamp(0.875rem, 2.8vw, 1.15rem)' }}
              >
                {exp.role}
              </h3>
              {/* Active pill — tiny, inline */}
              {isActive && (
                <span className="flex items-center gap-1 text-xs text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              )}
            </div>
            <p className="text-accent font-semibold text-xs sm:text-sm mt-0.5 truncate">
              {exp.organization}
            </p>
          </div>
        </div>

        {/* ── META ROW: date + type on one line, small ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4 ml-12 sm:ml-14">
          <span className="flex items-center gap-1 text-xs text-text-muted font-mono bg-surface-2 border border-border px-2.5 py-1 rounded-lg flex-shrink-0">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {exp.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-muted bg-surface-2 border border-border px-2.5 py-1 rounded-lg flex-shrink-0">
            <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
            {/* Short label on mobile */}
            <span className="hidden sm:inline">{exp.type}</span>
            <span className="sm:hidden">Club</span>
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-accent/20 via-border to-transparent mb-4" />

        {/* ── ACHIEVEMENTS ── */}
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            <Award className="w-3 h-3 text-accent" />
            Contributions
          </p>

          <ul className="flex flex-col gap-2.5">
            {exp.achievements.map((item, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: index * 0.12 + j * 0.07 + 0.25 }}
                className="flex items-start gap-2.5 group"
              >
                <span className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                <p
                  className="text-text-secondary leading-relaxed"
                  style={{ fontSize: 'clamp(0.78rem, 2vw, 0.875rem)' }}
                >
                  {item}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

      </GlowCard>
    </motion.div>
  )
}
