'use client'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  glow?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-primary font-semibold hover:bg-accent-hover shadow-glow-sm hover:shadow-glow',
  secondary:
    'bg-surface-2 text-text-primary border border-border hover:border-accent hover:text-accent',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2',
  outline:
    'bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary',
  danger:
    'bg-error/10 border border-error text-error hover:bg-error hover:text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2 gap-1.5 rounded-lg',
  md: 'text-base px-6 py-3 gap-2 rounded-xl',
  lg: 'text-lg px-8 py-4 gap-2.5 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      glow = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'inline-flex items-center justify-center font-inter transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          glow && 'animate-pulse-glow',
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
