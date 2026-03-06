'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MapPin, GraduationCap, Briefcase,
  Code2, Globe, Shield, Database,
  Cloud, Terminal, Layers,
} from 'lucide-react'
import { GlowCard } from '@/components/atoms/GlowCard'
import { Badge } from '@/components/atoms/Badge'
import { fadeUp, slideInLeft } from '@/lib/utils/animations'
import resumeData from '@/lib/data/resume.json'

/* ─── Skill categories — no soft skills ─────────────────────── */
const SKILL_GROUPS = [
  {
    icon:  <Code2    className="w-4 h-4" />,
    label: 'Languages',
    color: '#00D4FF',
    bg:    'rgba(0,212,255,0.08)',
    border:'rgba(0,212,255,0.2)',
    items: resumeData.skills.languages,
  },
  {
    icon:  <Layers   className="w-4 h-4" />,
    label: 'Frontend',
    color: '#7B5EA7',
    bg:    'rgba(123,94,167,0.08)',
    border:'rgba(123,94,167,0.2)',
    items: resumeData.skills.frontend,
  },
  {
    icon:  <Terminal className="w-4 h-4" />,
    label: 'Backend',
    color: '#00E5A0',
    bg:    'rgba(0,229,160,0.08)',
    border:'rgba(0,229,160,0.2)',
    items: resumeData.skills.backend.concat(resumeData.skills.realtime),
  },
  {
    icon:  <Shield   className="w-4 h-4" />,
    label: 'Security',
    color: '#FF4D6D',
    bg:    'rgba(255,77,109,0.08)',
    border:'rgba(255,77,109,0.2)',
    items: resumeData.skills.security,
  },
  {
    icon:  <Database className="w-4 h-4" />,
    label: 'Databases',
    color: '#FFB347',
    bg:    'rgba(255,179,71,0.08)',
    border:'rgba(255,179,71,0.2)',
    items: resumeData.skills.databases,
  },
  {
    icon:  <Cloud    className="w-4 h-4" />,
    label: 'Cloud & Tools',
    color: '#00D4FF',
    bg:    'rgba(0,212,255,0.08)',
    border:'rgba(0,212,255,0.15)',
    items: resumeData.skills.cloud.concat(resumeData.skills.tools),
  },
]

/* ─── Single skill chip ─────────────────────────────────────── */
function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-xs px-2 py-1 rounded-md font-mono border transition-colors duration-150 hover:scale-105 inline-block"
      style={{
        color,
        background:   `${color}12`,
        borderColor:  `${color}30`,
      }}
    >
      {label}
    </span>
  )
}

/* ─── Skill category card ───────────────────────────────────── */
function SkillCard({
  group, index,
}: {
  group: typeof SKILL_GROUPS[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl border p-4 flex flex-col gap-3 h-full"
      style={{
        background:   group.bg,
        borderColor:  group.border,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${group.color}18`, color: group.color }}
        >
          {group.icon}
        </div>
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: group.color }}
        >
          {group.label}
        </span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {group.items.map(item => (
          <Chip key={item} label={item} color={group.color} />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main section ──────────────────────────────────────────── */
export function AboutSection() {
    const ref = useRef<HTMLDivElement>(null)

  return (
    <section id="about" className="section-padding" aria-label="About section">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-accent text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">
            Get to Know Me
          </p>
          <h2
            className="font-space font-black text-text-primary"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            About Me
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
        </motion.div>

        {/* ── Two column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-8 lg:gap-12" ref={ref}>

          {/* ════════════════════════════
              LEFT — bio + education
              ════════════════════════════ */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            {/* Avatar card */}
            <GlowCard className="p-5 sm:p-6">
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-space font-black text-2xl text-primary"
                    style={{ background: 'linear-gradient(135deg, #00D4FF, #7B5EA7)' }}
                  >
                    K
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-primary" />
                </div>

                <div>
                  <h3 className="font-space font-bold text-text-primary text-base sm:text-lg leading-tight">
                    {resumeData.meta.name}
                  </h3>
                  <p className="text-accent text-xs sm:text-sm font-medium mt-0.5">
                    {resumeData.meta.title}
                  </p>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="success" dot className="text-xs">
                  Open to Work
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface-2 border border-border px-2.5 py-1 rounded-full">
                  <MapPin className="w-3 h-3 text-accent" />
                  Bhopal, India
                </span>
              </div>

              {/* Bio */}
              <p
                className="text-text-secondary leading-relaxed"
                style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
              >
I'm a 3rd-year B.Tech IT student at IIIT Bhopal with a dual passion for building high-performance full-stack systems and breaking them through cybersecurity research. As the Web Security Lead at Xploit Club, I lead CTF challenges, bug bounty sessions, and web exploitation workshops. I've shipped real-world projects — from real-time distributed systems to production e-commerce platforms — always focused on performance, security, and scale. When I'm not building, I'm breaking things (ethically).
              </p>
            </GlowCard>

            {/* Education card */}
            <GlowCard className="p-5 sm:p-6 hover:border-accent/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Education
                  </p>
                  {resumeData.education.map((ed, i) => (
                    <div key={i}>
                      <p
                        className="font-space font-bold text-text-primary leading-snug"
                        style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                      >
                        {ed.institution}
                      </p>
                      <p className="text-text-secondary text-xs mt-1">
                        {ed.degree}
                      </p>
                      <p className="text-accent font-mono text-xs mt-1">
                        {ed.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Current role card */}
            <GlowCard className="p-5 sm:p-6 hover:border-accent/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Currently
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className="font-space font-bold text-text-primary leading-snug"
                      style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}
                    >
                      {resumeData.experience[0]?.role}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Active
                    </span>
                  </div>
                  <p className="text-accent text-xs mt-0.5 truncate">
                    {resumeData.experience[0]?.organization}
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* ════════════════════════════
              RIGHT — skill bento grid
              ════════════════════════════ */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <Globe className="w-4 h-4 text-accent" />
              <h3
                className="font-space font-bold text-text-primary"
                style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}
              >
                Tech Stack
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
            </motion.div>

            {/* ── Bento grid — 2 cols on mobile, 3 on lg ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {SKILL_GROUPS.map((group, i) => (
                <SkillCard key={group.label} group={group} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
