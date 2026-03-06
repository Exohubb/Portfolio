import { HeroSection }           from '@/components/organisms/HeroSection'
import { AboutSection }          from '@/components/organisms/AboutSection'
import { NetworkTrackerWrapper } from '@/components/organisms/NetworkTrackerWrapper'
import { ProjectsGrid }          from '@/components/organisms/ProjectsGrid'
import { ExperienceSection }     from '@/components/organisms/ExperienceSection'
import { CertificationsSection } from '@/components/organisms/CertificationsSection'
import { ContactSection }        from '@/components/organisms/ContactSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <NetworkTrackerWrapper />   {/* ✅ wrapper — not NetworkTrackerSection */}
      <ProjectsGrid />
      <ExperienceSection />
      <CertificationsSection />
      <ContactSection />
    </main>
  )
}
