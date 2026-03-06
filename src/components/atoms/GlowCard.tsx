'use client'
import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface GlowCardProps {
  children: ReactNode
  className?: string
  tilt?: boolean
}

export function GlowCard({ children, className, tilt = false }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    card.style.setProperty('--glow-x', `${x}%`)
    card.style.setProperty('--glow-y', `${y}%`)

    if (tilt) {
      const rotX = -((e.clientY - rect.top) / rect.height - 0.5) * 12
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 12
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('glow-card transition-transform duration-300', className)}
    >
      {children}
    </div>
  )
}
