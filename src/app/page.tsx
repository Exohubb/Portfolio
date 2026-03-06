import dynamic from 'next/dynamic'

const HeroSection       = dynamic(() => import('@/components/organisms/HeroSection').then(m => m.HeroSection),       { ssr: false })
const AboutSection      = dynamic(() => import('@/components/organisms/AboutSection').then(m => m.AboutSection),     { ssr: false })
const ProjectsSection   = dynamic(() => import('@/components/organisms/ProjectsSection').then(m => m.ProjectsSection), { ssr: false })
const ExperienceSection = dynamic(() => import('@/components/organisms/ExperienceSection').then(m => m.ExperienceSection), { ssr: false })
const CertsSection      = dynamic(() => import('@/components/organisms/CertsSection').then(m => m.CertsSection),     { ssr: false })
const ContactSection    = dynamic(() => import('@/components/organisms/ContactSection').then(m => m.ContactSection), { ssr: false })
const NetworkSection    = dynamic(() => import('@/components/organisms/NetworkSection').then(m => m.NetworkSection), { ssr: false })

export default function HomePage() {
  return (
    <>
      <section id="home"><HeroSection /></section>
      <section id="about"><AboutSection /></section>
      <section id="network"><NetworkSection /></section>
      <section id="projects"><ProjectsSection /></section>
      <section id="experience"><ExperienceSection /></section>
      <section id="certs"><CertsSection /></section>
      <section id="contact"><ContactSection /></section>
    </>
  )
}
