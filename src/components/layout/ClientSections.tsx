'use client'
import dynamic from 'next/dynamic'

const HeroSection            = dynamic(() => import('@/components/organisms/HeroSection').then(m => m.HeroSection),                       { ssr: false })
const AboutSection           = dynamic(() => import('@/components/organisms/AboutSection').then(m => m.AboutSection),                     { ssr: false })
const NetworkTrackerSection  = dynamic(() => import('@/components/organisms/NetworkTrackerSection').then(m => m.NetworkTrackerSection),   { ssr: false })
const ProjectsGrid           = dynamic(() => import('@/components/organisms/ProjectsGrid').then(m => m.ProjectsGrid),                     { ssr: false })
const ExperienceSection      = dynamic(() => import('@/components/organisms/ExperienceSection').then(m => m.ExperienceSection),           { ssr: false })
const CertificationsSection  = dynamic(() => import('@/components/organisms/CertificationsSection').then(m => m.CertificationsSection),   { ssr: false })
const ContactSection         = dynamic(() => import('@/components/organisms/ContactSection').then(m => m.ContactSection),                 { ssr: false })

export function ClientSections() {
  return (
    <>
      <section id="home"><HeroSection /></section>
      <section id="about"><AboutSection /></section>
      <section id="network"><NetworkTrackerSection /></section>
      <section id="projects"><ProjectsGrid /></section>
      <section id="experience"><ExperienceSection /></section>
      <section id="certs"><CertificationsSection /></section>
      <section id="contact"><ContactSection /></section>
    </>
  )
}
