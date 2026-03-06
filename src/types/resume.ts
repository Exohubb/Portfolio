export interface Meta {
  name: string
  title: string
  tagline: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  codolio: string
  open_to_work: boolean
  resume_url: string
}

export interface Education {
  institution: string
  degree: string
  duration: string
  cgpa: string | null
}

export interface Experience {
  role: string
  organization: string
  type: string
  duration: string
  achievements: string[]
}

export interface Project {
  id: string
  title: string
  subtitle: string
  category: string[]
  duration: string
  highlight: boolean
  description: string
  metrics: string[]
  stack: string[]
  live_url: string | null
  github_url: string | null
  screenshot_placeholder: string
}

export interface Certification {
  title: string
  issuer: string
  year: string
  description: string
  certificate_id: string | null
  verify_url: string
}

export interface Skills {
  languages: string[]
  frontend: string[]
  backend: string[]
  realtime: string[]
  security: string[]
  databases: string[]
  cloud: string[]
  tools: string[]
  platforms: string[]
  soft: string[]
}

export interface ResumeData {
  meta: Meta
  education: Education[]
  experience: Experience[]
  projects: Project[]
  certifications: Certification[]
  skills: Skills
}
