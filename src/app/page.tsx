import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-bg px-6">
      <div className="hero-grid" aria-hidden="true" />
      <div className="text-center relative z-10">
        <h1 className="font-space text-[10rem] font-black leading-none gradient-text">
          404
        </h1>
        <p className="text-2xl font-space font-bold text-text-primary mb-3">
          Page Not Found
        </p>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          Looks like this page doesn&apos;t exist. Even great systems have missing routes.
        </p>
        <Link href="/">
          <Button
            variant="primary"
            size="lg"
            icon={<Home className="w-5 h-5" />}
            iconPosition="left"
            glow
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
