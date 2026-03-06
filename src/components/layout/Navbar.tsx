'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '#home',           label: 'Home'          },
  { href: '#about',          label: 'About'         },
  { href: '#network',        label: 'Network'       },
  { href: '#projects',       label: 'Projects'      },
  { href: '#experience',     label: 'Experience'    },
  { href: '#certifications', label: 'Certs'         },
  { href: '#contact',        label: 'Contact'       },
]

export function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [hidden,     setHidden]     = useState(false)   // ← hides on scroll-down (mobile)
  const [activeLink, setActiveLink] = useState('#home')

  const lastY     = useRef(0)
  const { scrollY } = useScroll()

  /* ── Hide on scroll-down / show on scroll-up ── */
  useMotionValueEvent(scrollY, 'change', (y) => {
    const isMobile = window.innerWidth < 768
    setScrolled(y > 20)

    if (isMobile && !menuOpen) {
      const diff = y - lastY.current
      if (diff > 6 && y > 80) {
        setHidden(true)          // scrolling DOWN  → hide
      } else if (diff < -6) {
        setHidden(false)         // scrolling UP    → show
      }
    } else {
      setHidden(false)           // always show on desktop
    }

    lastY.current = y
  })

  /* Always show when menu is open */
  useEffect(() => {
    if (menuOpen) setHidden(false)
  }, [menuOpen])

  /* Close menu on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Active section tracking */
  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.querySelector(l.href))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveLink(`#${e.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach(s => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR — slides up on mobile scroll-down
          ══════════════════════════════════════════ */}
      <motion.header
        animate={{
          y:       hidden ? '-100%' : '0%',
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-colors duration-300',
          scrolled
            ? 'bg-primary/90 backdrop-blur-xl border-b border-border shadow-lg'
            : 'bg-transparent',
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 group"
              aria-label="Kapil Meena — Back to top"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Code2 className="w-4 h-4 text-accent" />
              </div>
              <span className="font-space font-bold text-text-primary text-sm sm:text-base">
                Kapil<span className="text-accent">.</span>
              </span>
            </a>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                    activeLink === href
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2',
                  )}
                  aria-current={activeLink === href ? 'page' : undefined}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden w-9 h-9 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <motion.span
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.span>
            </button>

          </div>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════════
          MOBILE MENU OVERLAY
          ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-down panel */}
            <motion.nav
              key="mobile-menu"
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-14 inset-x-0 z-40 md:hidden bg-surface/95 backdrop-blur-xl border-b border-border shadow-2xl"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      activeLink === href
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
                    )}
                    aria-current={activeLink === href ? 'page' : undefined}
                  >
                    {label}
                    {activeLink === href && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
