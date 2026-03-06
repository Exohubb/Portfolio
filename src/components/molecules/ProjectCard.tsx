'use client'
import { useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Zap, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { fadeUp } from '@/lib/utils/animations'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types/resume'

interface ProjectCardProps {
  project: Project
  index?: number
  onClick?: () => void
}

export function ProjectCard({ project, index = 0, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 14
    const gx = ((e.clientX - rect.left) / rect.width) * 100
    const gy = ((e.clientY - rect.top) / rect.height) * 100
    card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
    card.style.setProperty('--glow-x', `${gx}%`)
    card.style.setProperty('--glow-y', `${gy}%`)
  }
  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08 }}
      className="h-full"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glow-card group cursor-pointer h-full flex flex-col transition-all duration-300"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* Top visual area */}
        <div className="relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-surface-2 to-primary flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-2/5 group-hover:from-accent/10 group-hover:to-accent-2/10 transition-all duration-500" />

          {/* Grid lines decoration */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent h-full"
                style={{ left: `${25 + i * 17}%` }}
              />
            ))}
          </div>

          {/* Center icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 shadow-glow-sm">
            <Zap className="w-8 h-8 text-accent" />
          </div>

          {/* Badges */}
          {project.highlight && (
            <div className="absolute top-3 left-3">
              <Badge variant="featured" dot>Featured</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="text-xs text-text-muted bg-primary/80 px-2 py-1 rounded-lg backdrop-blur-sm font-mono border border-border/50">
              {project.duration}
            </span>
          </div>

          {/* Category chip */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs bg-accent/15 text-accent border border-accent/30 px-2 py-0.5 rounded-md font-medium">
              {Array.isArray(project.category) ? project.category[0] : project.category}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 flex flex-col gap-4 flex-1">
          {/* Title + subtitle */}
          <div>
            <h3 className="font-space text-lg font-bold text-text-primary group-hover:text-accent transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">{project.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.metrics.slice(0, 2).map(m => (
                <Badge key={m} variant="accent" className="text-xs">{m}</Badge>
              ))}
            </div>
          )}

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.stack.slice(0, 4).map(tech => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded-md bg-surface-2 text-text-muted border border-border font-mono hover:border-accent/40 hover:text-accent transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-md bg-surface-2 text-text-muted border border-border font-mono">
                +{project.stack.length - 4} more
              </span>
            )}
          </div>

          {/* ✅ NEW: Animated action buttons */}
          <div className="flex gap-2 pt-1" onClick={e => e.stopPropagation()}>
            {/* View Details button */}
            <button
              onClick={onClick}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold',
                'bg-accent/10 text-accent border border-accent/30',
                'hover:bg-accent hover:text-primary transition-all duration-200 group/btn',
                'relative overflow-hidden'
              )}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                Details
              </span>
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.5 }}
              />
            </button>

            {/* Live Demo button */}
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold',
                  'bg-success/10 text-success border border-success/30',
                  'hover:bg-success hover:text-white transition-all duration-200',
                  'relative overflow-hidden group/live'
                )}
                aria-label={`View live demo of ${project.title}`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 group-hover/live:rotate-12 transition-transform" />
                  Live
                </span>
                {/* Pulse dot */}
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              </motion.a>
            )}

            {/* GitHub button */}
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-xl text-xs font-semibold flex-shrink-0',
                  'bg-surface-2 text-text-muted border border-border',
                  'hover:border-accent/40 hover:text-accent transition-all duration-200'
                )}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
