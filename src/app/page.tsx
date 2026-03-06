import { HeroSection } from '@/components/organisms/HeroSection'
import dynamic from 'next/dynamic'

const AboutSection = dynamic(
  () => import('@/components/organisms/AboutSection').then(m => m.AboutSection), { ssr: true }
)
const NetworkTrackerSection = dynamic(
  () => import('@/components/organisms/NetworkTrackerSection').then(m => m.NetworkTrackerSection), { ssr: false }
)
const ProjectsGrid = dynamic(
  () => import('@/components/organisms/ProjectsGrid').then(m => m.ProjectsGrid), { ssr: true }
)
const ExperienceSection = dynamic(
  () => import('@/components/organisms/ExperienceSection').then(m => m.ExperienceSection), { ssr: true }
)
const CertificationsSection = dynamic(
  () => import('@/components/organisms/CertificationsSection').then(m => m.CertificationsSection), { ssr: true }
)
const ContactSection = dynamic(
  () => import('@/components/organisms/ContactSection').then(m => m.ContactSection), { ssr: true }
)
const Footer = dynamic(
  () => import('@/components/organisms/Footer').then(m => m.Footer), { ssr: true }
)

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NetworkTrackerSection />
      <ProjectsGrid />
      <ExperienceSection />
      <CertificationsSection />
      <ContactSection />
      <Footer />
    </>
  )
}
