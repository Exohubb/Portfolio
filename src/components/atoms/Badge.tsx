import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

type BadgeVariant = 'accent' | 'purple' | 'success' | 'warning' | 'error' | 'neutral' | 'featured'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}

const badgeVariants: Record<BadgeVariant, string> = {
  accent: 'bg-accent/10 text-accent border-accent/20',
  purple: 'bg-accent-2/10 text-accent-2 border-accent-2/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  neutral: 'bg-surface-2 text-text-secondary border-border',
  featured:
    'bg-gradient-to-r from-accent/20 to-accent-2/20 text-accent border-accent/30',
}

export function Badge({ children, variant = 'neutral', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        badgeVariants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'accent' && 'bg-accent',
            variant === 'success' && 'bg-success animate-pulse',
            variant === 'featured' && 'bg-accent'
          )}
        />
      )}
      {children}
    </span>
  )
}
