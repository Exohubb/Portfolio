'use client'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'

const LoadingScreen = dynamic(
  () => import('@/components/organisms/LoadingScreen').then(m => m.LoadingScreen),
  { ssr: false }
)
const Navbar = dynamic(
  () => import('@/components/layout/Navbar').then(m => m.Navbar),
  { ssr: false }
)
const SettingsPanel = dynamic(
  () => import('@/components/layout/SettingsPanel').then(m => m.SettingsPanel),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LenisProvider>
        <LoadingScreen />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navbar />
        <main id="main-content">{children}</main>
        <SettingsPanel />
      </LenisProvider>
    </ThemeProvider>
  )
}
