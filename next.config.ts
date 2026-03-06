// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',        // ← optimized for Vercel
  images: {
    unoptimized: false,
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
