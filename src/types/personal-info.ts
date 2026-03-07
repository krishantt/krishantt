export type MonthYear = {
  year: number
  month: number
}

export type PersonalBasics = {
  name: string
  headline: string
  summary: string
  email: string | null
  phone: string | null
  location?: string | null
  website?: string | null
}

export type PersonalSocial = {
  label: string
  href: string
}

export type SkillGroup = {
  title: string
  items: string[]
}

export type SpokenLanguage = {
  name: string
  proficiency: string
}

export type ExperienceRole = {
  title: string
  start: MonthYear
  end?: MonthYear
  points: string[]
  employmentType?: string
  location?: string
  skills?: string[]
}

export type ExperienceItem = {
  org: string
  roles: ExperienceRole[]
}

export type EducationItem = {
  title: string
  place: string
  period: string
  details: string[]
}

export type ProjectItem = {
  title: string
  href: string
  summary: string
}

export type PersonalInfo = {
  basics: PersonalBasics
  socials: PersonalSocial[]
  skills: SkillGroup[]
  focusAreas: string[]
  languages: SpokenLanguage[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  leadership: string[]
  certifications: string[]
  awards: string[]
}
