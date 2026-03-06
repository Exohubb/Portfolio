import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },

  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'three'],
  },

  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',           value: 'DENY'                          },
        { key: 'X-Content-Type-Options',    value: 'nosniff'                       },
        { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin'},
        { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },

  // ✅ Forces single React instance — fixes ReactCurrentBatchConfig crash
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react':     path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    }
    return config
  },
}

export default nextConfig
