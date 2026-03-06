'use client'
import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'dark' | 'light' | 'eye-comfort'
export type TextSize = 'sm' | 'md' | 'lg'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  textSize: TextSize
  setTextSize: (s: TextSize) => void
  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
  highContrast: boolean
  setHighContrast: (v: boolean) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const TEXT_SCALE: Record<TextSize, string> = {
  sm: '0.9',
  md: '1',
  lg: '1.15',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [textSize, setTextSizeState] = useState<TextSize>('md')
  const [reducedMotion, setReducedMotionState] = useState(false)
  const [highContrast, setHighContrastState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const savedSize = localStorage.getItem('textSize') as TextSize | null
    const savedMotion = localStorage.getItem('reducedMotion')
    const savedContrast = localStorage.getItem('highContrast')

    if (saved) setThemeState(saved)
    if (savedSize) setTextSizeState(savedSize)
    if (savedMotion) setReducedMotionState(savedMotion === 'true')
    if (savedContrast) setHighContrastState(savedContrast === 'true')
    setMounted(true)
  }, [])

  const applyTheme = useCallback((t: Theme, size: TextSize, rm: boolean, hc: boolean) => {
    const root = document.documentElement
    root.setAttribute('data-theme', t)
    root.style.setProperty('--font-scale', TEXT_SCALE[size])
    if (rm) root.classList.add('reduce-motion')
    else root.classList.remove('reduce-motion')
    if (hc) root.classList.add('high-contrast')
    else root.classList.remove('high-contrast')
  }, [])

  useEffect(() => {
    if (mounted) applyTheme(theme, textSize, reducedMotion, highContrast)
  }, [theme, textSize, reducedMotion, highContrast, mounted, applyTheme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }
  const setTextSize = (s: TextSize) => {
    setTextSizeState(s)
    localStorage.setItem('textSize', s)
  }
  const setReducedMotion = (v: boolean) => {
    setReducedMotionState(v)
    localStorage.setItem('reducedMotion', String(v))
  }
  const setHighContrast = (v: boolean) => {
    setHighContrastState(v)
    localStorage.setItem('highContrast', String(v))
  }

  if (!mounted) return null

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, textSize, setTextSize, reducedMotion, setReducedMotion, highContrast, setHighContrast }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
