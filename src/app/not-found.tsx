import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--color-primary)' }}
    >
      <div className="text-center">
        <h1
          className="font-space font-black leading-none"
          style={{
            fontSize: '10rem',
            background: 'linear-gradient(135deg, #00D4FF, #7B5EA7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>
        <p
          className="text-2xl font-space font-bold mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Page Not Found
        </p>
        <p
          className="mb-8 max-w-sm mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Looks like this page does not exist. Even great systems have missing routes.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            background: '#00D4FF',
            color: '#000',
            fontWeight: 600,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
