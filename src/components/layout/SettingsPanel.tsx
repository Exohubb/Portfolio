'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Settings, X, Sun, Moon, Eye, Contrast } from 'lucide-react'
import { useTheme } from '@/lib/hooks/useTheme'
import { cn } from '@/lib/utils/cn'
import type { Theme, TextSize } from '@/components/providers/ThemeProvider'

/* ── Animation variants ───────────────────────────────────── */
const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
}

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 12,
    transformOrigin: 'bottom right',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transformOrigin: 'bottom right',
    transition: { type: 'spring' as const, stiffness: 380, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 12,
    transformOrigin: 'bottom right',
    transition: { duration: 0.18, ease: 'easeIn' as const },
  },
}

const itemVariants: Variants = {
  hidden:  { opacity: 0, x: 10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' as const },
  }),
}

/* ── Data ─────────────────────────────────────────────────── */
const THEMES: { id: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'dark',        label: 'Night',       icon: <Moon className="w-4 h-4" />, desc: 'Dark, cinematic' },
  { id: 'light',       label: 'Light',       icon: <Sun  className="w-4 h-4" />, desc: 'Clean & bright' },
  { id: 'eye-comfort', label: 'Eye Comfort', icon: <Eye  className="w-4 h-4" />, desc: 'Warm, low-blue' },
]

const SIZES: { id: TextSize; label: string; aria: string }[] = [
  { id: 'sm', label: 'A−', aria: 'Small text'  },
  { id: 'md', label: 'A',  aria: 'Medium text' },
  { id: 'lg', label: 'A+', aria: 'Large text'  },
]

/* ── Component ────────────────────────────────────────────── */
export function SettingsPanel() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  const {
    theme, setTheme,
    textSize, setTextSize,
    highContrast, setHighContrast,
  } = useTheme()

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as Node
    if (
      panelRef.current   && !panelRef.current.contains(target) &&
      triggerRef.current && !triggerRef.current.contains(target)
    ) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => {
        document.addEventListener('mousedown', handleOutsideClick)
      }, 50)
      return () => {
        clearTimeout(id)
        document.removeEventListener('mousedown', handleOutsideClick)
      }
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [open, handleOutsideClick])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const toggle = () => setOpen(prev => !prev)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="settings-backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[59]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-10 right-6 sm:bottom-6 sm:right-6 z-[60]">

        <motion.button
          ref={triggerRef}
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className={cn(
            'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center',
            'shadow-lg transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent outline-none',
            open
              ? 'bg-surface-2 text-text-primary border border-border'
              : 'bg-accent text-primary hover:bg-accent-hover shadow-glow-sm',
          )}
          aria-label={open ? 'Close settings' : 'Open settings'}
          aria-expanded={open}
          aria-controls="settings-panel"
          aria-haspopup="dialog"
        >
          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
            className="flex items-center justify-center"
          >
            {open
              ? <X className="w-5 h-5" />
              : <Settings className="w-5 h-5" />
            }
          </motion.span>
        </motion.button>

        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              key="settings-panel"
              ref={panelRef}
              id="settings-panel"
              role="dialog"
              aria-modal="false"
              aria-label="Appearance settings"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'absolute bottom-14 right-0',
                'w-[calc(100vw-2rem)] max-w-[17rem] sm:w-72',
                'rounded-2xl border border-border shadow-2xl',
                'bg-[var(--color-surface)] overflow-hidden',
              )}
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-accent via-accent-2 to-transparent" />

              <div className="p-4 sm:p-5">

                <motion.div
                  custom={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-2 mb-5"
                >
                  <Settings className="w-4 h-4 text-accent" />
                  <h2 className="font-space font-bold text-text-primary text-sm">
                    Appearance
                  </h2>
                </motion.div>

                {/* ── Theme ── */}
                <motion.div
                  custom={1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-5"
                >
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Theme
                  </p>
                  <div className="flex flex-col gap-2">
                    {THEMES.map(({ id, label, icon, desc }) => (
                      <button
                        key={id}
                        onClick={() => setTheme(id)}
                        className={cn(
                          'flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all duration-150 border outline-none',
                          'focus-visible:ring-2 focus-visible:ring-accent',
                          theme === id
                            ? 'bg-accent/15 border-accent/40 text-accent'
                            : 'bg-surface-2 border-border text-text-secondary hover:border-accent/30 hover:bg-accent/5',
                        )}
                        aria-pressed={theme === id}
                      >
                        <span className="flex-shrink-0">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium leading-none">{label}</div>
                          <div className="text-xs opacity-55 mt-0.5">{desc}</div>
                        </div>
                        <AnimatePresence>
                          {theme === id && (
                            <motion.div
                              layoutId="theme-dot"
                              className="w-2 h-2 rounded-full bg-accent flex-shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
                            />
                          )}
                        </AnimatePresence>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* ── Text size ── */}
                <motion.div
                  custom={2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-5"
                >
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Text Size
                  </p>
                  <div className="flex gap-2">
                    {SIZES.map(({ id, label, aria }) => (
                      <button
                        key={id}
                        onClick={() => setTextSize(id)}
                        className={cn(
                          'flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 border outline-none',
                          'focus-visible:ring-2 focus-visible:ring-accent',
                          textSize === id
                            ? 'bg-accent text-primary border-accent shadow-glow-sm'
                            : 'bg-surface-2 text-text-secondary border-border hover:border-accent/30',
                        )}
                        aria-pressed={textSize === id}
                        aria-label={aria}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* ── High Contrast ── */}
                <motion.div
                  custom={3}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Accessibility
                  </p>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-2 border border-border">
                    <div className="flex items-center gap-2.5">
                      <Contrast className="w-4 h-4 text-text-muted flex-shrink-0" />
                      <div>
                        <p className="text-sm text-text-primary leading-none">High Contrast</p>
                        <p className="text-xs text-text-muted mt-0.5">Stronger text</p>
                      </div>
                    </div>

                    <button
                      role="switch"
                      aria-checked={highContrast}
                      aria-label="Toggle high contrast"
                      onClick={() => setHighContrast(!highContrast)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
                        'focus-visible:ring-2 focus-visible:ring-accent outline-none ml-3',
                        highContrast ? 'bg-accent' : 'bg-border',
                      )}
                    >
                      <motion.div
                        animate={{ x: highContrast ? 20 : 2 }}
                        transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </button>
                  </div>
                </motion.div>

                <motion.p
                  custom={4}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xs text-text-muted text-center mt-4 pt-3 border-t border-border"
                >
                  Built by{' '}
                  <span className="text-accent font-medium">Kapil Meena</span>
                </motion.p>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
