import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { Navbar } from '@/components/layout/Navbar'
import { SettingsPanel } from '@/components/layout/SettingsPanel'
import { LoadingScreen } from '@/components/organisms/LoadingScreen'
import './globals.css'

// ✅ FIXED — removed axes:['wght']
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kapilmeena.dev'),
  title: {
    default: 'Kapil Meena — Full-Stack Developer & Cybersecurity Engineer',
    template: '%s | Kapil Meena',
  },
  description:
    'Kapil Meena is a Full-Stack Developer and Web Security Lead at IIIT Bhopal, specializing in real-time systems, Next.js, and penetration testing.',
  keywords: ['Kapil Meena', 'Full-Stack Developer', 'Cybersecurity', 'IIIT Bhopal', 'Next.js', 'Penetration Testing'],
  authors: [{ name: 'Kapil Meena', url: 'https://kapilmeena.dev' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kapilmeena.dev',
    siteName: 'Kapil Meena Portfolio',
    title: 'Kapil Meena — Full-Stack Developer & Cybersecurity Engineer',
    description: 'IIIT Bhopal student building high-performance full-stack systems and leading web security.',
    images: [{ url: '/assets/og-image.png', width: 1200, height: 630, alt: 'Kapil Meena Portfolio' }],
  },
  twitter: { card: 'summary_large_image', title: 'Kapil Meena', images: ['/assets/og-image.png'] },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kapil Meena',
  jobTitle: 'Full-Stack Developer & Cybersecurity Engineer',
  url: 'https://kapilmeena.dev',
  sameAs: [
    'https://www.linkedin.com/in/kapil-meena',
    'https://github.com/kapilmeena',
    'https://codolio.com/profile/kapilmeena',
  ],
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);var s=localStorage.getItem('textSize')||'md';var sc={'sm':'0.9','md':'1','lg':'1.15'}[s]||'1';document.documentElement.style.setProperty('--font-scale',sc);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#00D4FF" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-inter bg-primary text-text-primary`}>
        <ThemeProvider>
          <LenisProvider>
            <LoadingScreen />
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Navbar />
            <main id="main-content">{children}</main>
            <SettingsPanel />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
