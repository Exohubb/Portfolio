'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Each step types out then resolves with a status line
const STEPS = [
  {
    cmd:    '> Initializing portfolio.exe',
    ok:     '  ✓ Runtime environment ready',
    color:  '#00D4FF',
    delay:  0,
    ms:     500,
  },
  {
    cmd:    '> Establishing TLS 1.3 handshake...',
    ok:     '  ✓ Secure channel established',
    color:  '#00E5A0',
    delay:  620,
    ms:     700,
  },
  {
    cmd:    '> Fetching your IP address...',
    ok:     null,           // dynamic — filled with real IP
    dynamic: 'ip',
    color:  '#FFB347',
    delay:  1420,
    ms:     900,
  },
  {
    cmd:    '> Scanning browser fingerprint...',
    ok:     null,           // dynamic — browser name
    dynamic: 'browser',
    color:  '#7B5EA7',
    delay:  2420,
    ms:     700,
  },
  {
    cmd:    '> Loading 3D Earth globe assets...',
    ok:     '  ✓ WebGL 2.0 shaders compiled',
    color:  '#00D4FF',
    delay:  3220,
    ms:     600,
  },
  {
    cmd:    '> Fetching portfolio data...',
    ok:     '  ✓ 6 projects · 2 certs loaded',
    color:  '#00E5A0',
    delay:  3920,
    ms:     500,
  },
  {
    cmd:    '> Launching portfolio...',
    ok:     '  ✓ All systems go!',
    color:  '#00D4FF',
    delay:  4520,
    ms:     400,
  },
]

interface Line {
  text: string
  color: string
  isStatus: boolean
}

export function LoadingScreen() {
  const [visible,   setVisible]   = useState(true)
  const [exiting,   setExiting]   = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [lines,     setLines]     = useState<Line[]>([])
  const [ipData,    setIpData]    = useState<{ ip: string; city: string; country: string } | null>(null)
  const [browserName, setBrowserName] = useState('Unknown Browser')
  const bodyRef = useRef<HTMLDivElement>(null)

  // Scroll terminal to bottom
  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  // Fetch IP in background
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setIpData({ ip: d.ip, city: d.city, country: d.country_name }))
      .catch(() => setIpData({ ip: '---', city: 'Unknown', country: '' }))

    const ua = navigator.userAgent
    const b =
      ua.includes('Edg/')    ? 'Microsoft Edge' :
      ua.includes('Chrome/') ? 'Google Chrome'  :
      ua.includes('Firefox/')? 'Mozilla Firefox':
      ua.includes('Safari/') ? 'Apple Safari'   : 'Unknown Browser'
    setBrowserName(b)
  }, [])

  // Add terminal lines on schedule
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((step, i) => {
      // Command line appears
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, { text: step.cmd, color: step.color, isStatus: false }])
        setProgress(Math.round(((i + 0.5) / STEPS.length) * 100))
      }, step.delay))

      // Status / result appears after ms
      timers.push(setTimeout(() => {
        let statusText = step.ok
        if (step.dynamic === 'ip') {
          const ip   = ipData?.ip   || 'fetching...'
          const city = ipData?.city || ''
          statusText = `  ✓ IP: ${ip}  ${city ? `· ${city}` : ''} detected`
        }
        if (step.dynamic === 'browser') {
          statusText = `  ✓ ${browserName} · ${
            navigator.platform.includes('Win') ? 'Windows' :
            navigator.platform.includes('Mac') ? 'macOS'   :
            navigator.platform.includes('Lin') ? 'Linux'   : 'Unknown OS'
          } detected`
        }
        if (statusText) {
          setLines(prev => [...prev, { text: statusText!, color: step.color, isStatus: true }])
        }
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, step.delay + step.ms))
    })

    // Done — exit after all steps
    const totalDuration = STEPS[STEPS.length - 1].delay + STEPS[STEPS.length - 1].ms + 500
    timers.push(setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setExiting(true)
        setTimeout(() => setVisible(false), 850)
      }, 350)
    }, totalDuration))

    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipData, browserName])

  if (!visible) return null

  return (
    <div className={`loading-screen${exiting ? ' exiting' : ''}`}>

      {/* Background particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent/20"
          style={{
            width:  Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left:   `${Math.random() * 100}%`,
            top:    `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Inner container — capped at 600px, full-width on mobile */}
      <div className="relative z-10 w-full flex flex-col items-center gap-5">

        {/* Header text */}
        <div className="text-center mb-1">
          <motion.h1
            className="font-space font-black gradient-text tracking-widest"
            style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            KAPIL MEENA
          </motion.h1>
          <motion.p
            className="text-text-muted font-mono uppercase tracking-widest mt-1"
            style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Portfolio v2.0 · Secure Boot
          </motion.p>
        </div>

        {/* Terminal window */}
        <motion.div
          className="terminal-window"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 25 }}
        >
          {/* Title bar */}
          <div className="terminal-titlebar">
            <div className="terminal-dot" style={{ background: '#FF5F57' }} />
            <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
            <div className="terminal-dot" style={{ background: '#28CA41' }} />
            <span
              className="ml-3 text-text-muted font-mono"
              style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}
            >
              portfolio.exe — bash
            </span>
            {/* Live blinking dot */}
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-success font-mono" style={{ fontSize: '10px' }}>LIVE</span>
            </span>
          </div>

          {/* Body — scrollable */}
          <div
            ref={bodyRef}
            className="terminal-body relative overflow-hidden"
            style={{ maxHeight: 'clamp(220px, 45vh, 340px)', overflowY: 'auto' }}
            aria-live="polite"
            aria-label="Loading progress terminal"
          >
            {/* Scan line */}
            <div className="scan-line" aria-hidden="true" />

            {/* Lines */}
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className="terminal-line"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line.isStatus ? (
                  <span style={{ color: line.color }}>{line.text}</span>
                ) : (
                  <span className="text-text-secondary">{line.text}</span>
                )}
              </motion.div>
            ))}

            {/* Blinking cursor at end */}
            {progress < 100 && (
              <span className="text-accent font-mono">
                {'> '}<span className="cursor-blink" />
              </span>
            )}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full" style={{ maxWidth: 'min(600px, calc(100vw - 2rem))' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-text-muted" style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}>
              LOADING ASSETS
            </span>
            <motion.span
              className="font-mono font-bold text-accent"
              style={{ fontSize: 'clamp(10px, 2.5vw, 13px)' }}
            >
              {progress}%
            </motion.span>
          </div>

          {/* Bar track */}
          <div className="relative h-1.5 rounded-full overflow-hidden bg-surface-2 border border-border">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00D4FF, #7B5EA7)',
                boxShadow: '0 0 10px rgba(0,212,255,0.5)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute top-0 bottom-0 w-8 bg-white/20 blur-sm skew-x-12"
              animate={{ x: ['-100%', '700%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Block progress bar (ASCII-style) */}
          <div
            className="mt-2 font-mono text-text-muted text-center"
            style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}
            aria-hidden="true"
          >
            {'['}
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                style={{
                  color: i < Math.floor(progress / 5) ? '#00D4FF' : 'rgba(74,96,128,0.5)',
                }}
              >
                {i < Math.floor(progress / 5) ? '█' : '░'}
              </span>
            ))}
            {']'} {progress}%
          </div>
        </div>

        {/* Status dots */}
        <div className="flex items-center gap-3 mt-1">
          {STEPS.map((_, i) => {
            const stepProgress = (i + 1) / STEPS.length * 100
            const done    = progress >= stepProgress
            const active  = progress >= (i / STEPS.length * 100) && !done
            return (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width:  done ? 10 : 6,
                  height: done ? 10 : 6,
                  background: done
                    ? '#00D4FF'
                    : active
                    ? 'rgba(0,212,255,0.5)'
                    : 'rgba(74,96,128,0.4)',
                  boxShadow: done ? '0 0 8px rgba(0,212,255,0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
