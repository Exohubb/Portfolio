'use client'
import dynamic from 'next/dynamic'

const NetworkTrackerSection = dynamic(
  () => import('@/components/organisms/NetworkTrackerSection').then(m => m.NetworkTrackerSection),
  { ssr: false }
)

export function NetworkTrackerWrapper() {
  return <NetworkTrackerSection />
}
