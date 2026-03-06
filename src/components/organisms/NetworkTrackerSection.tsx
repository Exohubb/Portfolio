'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, Globe, Monitor, Clock, Shield, Activity, Cpu } from 'lucide-react'
import { GlowCard } from '@/components/atoms/GlowCard'
import { fadeUp } from '@/lib/utils/animations'

interface GeoData {
  ip: string; city: string; region: string
  country_name: string; org: string
  timezone: string; country_code: string
}
interface BrowserInfo {
  browser: string; os: string; screen: string
  viewport: string; language: string
  timezone: string; connection: string
  doNotTrack: boolean
}

const HOPS = [
  { label: 'YOUR DEVICE', icon: '💻', color: '#00D4FF' },
  { label: 'HOME ROUTER', icon: '📡', color: '#7B5EA7' },
  { label: 'ISP NODE',    icon: '🌐', color: '#00E5A0' },
  { label: 'BACKBONE',    icon: '⚡', color: '#FFB347' },
  { label: 'CDN EDGE',   icon: '🔄', color: '#7B5EA7' },
  { label: 'SERVER',      icon: '🖥️', color: '#00D4FF' },
]

function SmallCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border hover:border-accent/40 transition-colors min-w-0">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-xs text-text-muted uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm text-text-primary font-mono truncate">{value}</p>
      </div>
    </div>
  )
}

export function NetworkTrackerSection() {
  const [geo,     setGeo]     = useState<GeoData | null>(null)
  const [browser, setBrowser] = useState<BrowserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [pkt,     setPkt]     = useState(0)      // 0–100 packet progress
  const [hopIdx,  setHopIdx]  = useState(0)
  const [latency] = useState(() => Math.floor(Math.random() * 35 + 10))
  const [hops]    = useState(() => Math.floor(Math.random() * 5 + 7))
  const raf = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    // Browser info
    const ua = navigator.userAgent
    const b =
      ua.includes('Edg/') ? 'Edge' : ua.includes('Chrome/') ? 'Chrome' :
      ua.includes('Firefox/') ? 'Firefox' : ua.includes('Safari/') ? 'Safari' : 'Unknown'
    const os =
      ua.includes('Win') ? 'Windows' : ua.includes('Mac') ? 'macOS' :
      ua.includes('Android') ? 'Android' :
      ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' :
      ua.includes('Linux') ? 'Linux' : 'Unknown'
    const conn = (navigator as unknown as { connection?: { effectiveType?: string } }).connection
    setBrowser({
      browser: b, os,
      screen: `${screen.width}×${screen.height}`,
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: conn?.effectiveType?.toUpperCase() || 'N/A',
      doNotTrack: navigator.doNotTrack === '1',
    })

    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { setGeo(d); setLoading(false) })
      .catch(() => {
        setGeo({ ip:'N/A', city:'Unknown', region:'', country_name:'Unknown', org:'N/A', timezone:'', country_code:'' })
        setLoading(false)
      })
  }, [])

  // Packet animation loop
  useEffect(() => {
    let t = 0
    raf.current = setInterval(() => {
      t = (t + 1.6) % 100
      setPkt(t)
      setHopIdx(Math.min(Math.floor((t / 100) * HOPS.length), HOPS.length - 1))
    }, 30)
    return () => clearInterval(raf.current)
  }, [])

  const maskIP = (ip: string) => {
    const p = ip.split('.')
    return p.length === 4 ? `${p[0]}.${p[1]}.*.*` : ip
  }

  return (
    <section id="network" className="section-padding" aria-label="Network tracker section">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
          <h2
            className="font-space font-black text-text-primary"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            What The Internet Knows About You
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-accent to-accent-2" />
          <p className="mt-4 text-text-secondary text-sm max-w-xl mx-auto px-2">
            A live read of your current session — every website sees this data.
          </p>
          <div className="mt-3">
          </div>
        </motion.div>

        {/* Main grid — stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

          {/* ── Left: User data ── */}
          <div>
            <h3 className="font-space font-bold text-text-primary text-base sm:text-lg mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent flex-shrink-0" />
              Your Exposed Data
              {loading && <span className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />}
            </h3>

            {/* IP card */}
            <GlowCard className="p-4 sm:p-5 mb-3">
              <AnimatePresence>
                {geo && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 flex-wrap">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl flex-shrink-0">
                      🌍
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-accent text-base sm:text-lg truncate">
                        {loading ? 'Fetching...' : maskIP(geo.ip)}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {geo.city}{geo.region ? `, ${geo.region}` : ''} · {geo.country_name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        ISP: {geo.org || '...'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-success font-mono">LIVE</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlowCard>

            {/* Browser data — 2-col grid on sm+ */}
            {browser && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <SmallCard icon={<Monitor className="w-4 h-4" />}  label="Browser"    value={browser.browser} />
                <SmallCard icon={<Cpu className="w-4 h-4" />}      label="OS"         value={browser.os} />
                <SmallCard icon={<Activity className="w-4 h-4" />} label="Screen"     value={browser.screen} />
                <SmallCard icon={<Wifi className="w-4 h-4" />}     label="Viewport"   value={browser.viewport} />
                <SmallCard icon={<Globe className="w-4 h-4" />}    label="Language"   value={browser.language} />
                <SmallCard icon={<Clock className="w-4 h-4" />}    label="Timezone"   value={browser.timezone.split('/')[1] || browser.timezone} />
                <SmallCard icon={<Wifi className="w-4 h-4" />}     label="Connection" value={browser.connection} />
                <SmallCard icon={<Shield className="w-4 h-4" />}   label="DNT"        value={browser.doNotTrack ? 'Enabled ✓' : 'Disabled ✗'} />
              </div>
            )}
          </div>

          {/* ── Right: Packet trace ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="font-space font-bold text-text-primary text-base sm:text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent flex-shrink-0" />
              Live Packet Trace
            </h3>

            <GlowCard className="p-4 sm:p-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                {[
                  { l: 'Latency', v: `${latency}ms`, c: latency < 30 ? 'text-success' : 'text-warning' },
                  { l: 'Hops',    v: hops.toString(), c: 'text-accent' },
                  { l: 'Packets', v: '∞',              c: 'text-accent-2' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="text-center p-2 sm:p-3 rounded-xl bg-surface-2 border border-border">
                    <p className={`font-mono font-bold text-lg sm:text-xl ${c}`}>{v}</p>
                    <p className="text-xs text-text-muted">{l}</p>
                  </div>
                ))}
              </div>

              {/* SVG packet animation — scales with container */}
              <div className="relative mb-5 overflow-hidden">
                <svg viewBox="0 0 100 40" className="w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  {/* Path line */}
                  <line x1="8" y1="20" x2="92" y2="20" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" strokeDasharray="2,2" />

                  {HOPS.map((hop, i) => {
                    const nx = 8 + i * 16.8
                    const reached = pkt >= (i / HOPS.length) * 100
                    return (
                      <g key={hop.label}>
                        {i < HOPS.length - 1 && (
                          <line
                            x1={nx} y1={20} x2={nx + 16.8} y2={20}
                            stroke={reached ? 'rgba(0,212,255,0.45)' : 'rgba(0,212,255,0.08)'}
                            strokeWidth="0.6"
                          />
                        )}
                        <circle cx={nx} cy={20} r={3} fill={reached ? hop.color : '#1A2E4A'} stroke={hop.color} strokeWidth="0.5" />
                        {reached && (
                          <circle cx={nx} cy={20} r={5} fill="none" stroke={hop.color} strokeWidth="0.4" opacity="0.4">
                            <animate attributeName="r" values="3;7;3" dur="1.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    )
                  })}

                  {/* Packet dot */}
                  {(() => {
                    const x = 8 + (pkt / 100) * 84
                    return (
                      <g>
                        <circle cx={x - 3} cy={20} r={1.5} fill="#00D4FF" opacity={0.35} />
                        <circle cx={x - 1.5} cy={20} r={1.8} fill="#00D4FF" opacity={0.55} />
                        <circle cx={x} cy={20} r={2.2} fill="#00D4FF" />
                      </g>
                    )
                  })()}
                </svg>
              </div>

              {/* Hop icons row */}
              <div className="grid grid-cols-6 gap-1 mb-5">
                {HOPS.map((hop, i) => (
                  <div
                    key={hop.label}
                    className="text-center transition-opacity duration-300"
                    style={{ opacity: i <= hopIdx ? 1 : 0.25 }}
                  >
                    <div className="text-base sm:text-lg mb-1">{hop.icon}</div>
                    <p className="text-text-muted leading-tight hidden sm:block" style={{ fontSize: '8px' }}>
                      {hop.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Trace route list */}
              <div className="space-y-1.5">
                {HOPS.map((hop, i) => {
                  const reached = i <= hopIdx
                  const ms = ((i + 1) * latency / HOPS.length).toFixed(1)
                  return (
                    <div
                      key={hop.label}
                      className={`flex items-center gap-2 sm:gap-3 p-2 rounded-lg text-xs sm:text-sm transition-all ${reached ? 'bg-accent/5 border border-accent/15' : 'opacity-30'}`}
                    >
                      <span className="font-mono text-text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: reached ? hop.color : '#4A6080' }} />
                      <span className="text-text-secondary flex-1 truncate">{hop.label}</span>
                      <span className="font-mono flex-shrink-0" style={{ color: reached ? hop.color : '#4A6080' }}>
                        {reached ? `${ms}ms` : '---'}
                      </span>
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-text-muted text-center mt-4 pt-3 border-t border-border">
                🛡️ {hops} hops · {latency}ms round-trip to server
              </p>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
