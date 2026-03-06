'use client'
import dynamic from 'next/dynamic'

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

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">{children}</main>
      <SettingsPanel />
    </>
  )
}
