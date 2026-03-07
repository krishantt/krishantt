import rawPersonalInfo from "../../personal-info.json"

import type {
  ExperienceItem,
  ExperienceRole,
  MonthYear,
  PersonalInfo,
} from "@/types/personal-info"

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function asRecord(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid object at ${path}`)
  }

  return value as Record<string, unknown>
}

function asString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new Error(`Invalid string at ${path}`)
  }

  return value
}

function asNullableString(value: unknown, path: string): string | null {
  if (value === null) return null
  return asString(value, path)
}

function asStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid string array at ${path}`)
  }

  return value.map((item, index) => asString(item, `${path}[${index}]`))
}

function asMonthYear(value: unknown, path: string): MonthYear {
  const data = asRecord(value, path)
  const year = data.year
  const month = data.month

  if (typeof year !== "number" || !Number.isInteger(year)) {
    throw new Error(`Invalid year at ${path}.year`)
  }

  if (
    typeof month !== "number" ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(`Invalid month at ${path}.month`)
  }

  return { year, month }
}

function parsePersonalInfo(value: unknown): PersonalInfo {
  const root = asRecord(value, "personal-info")

  const basicsRaw = asRecord(root.basics, "personal-info.basics")
  const basics = {
    name: asString(basicsRaw.name, "personal-info.basics.name"),
    headline: asString(basicsRaw.headline, "personal-info.basics.headline"),
    summary: asString(basicsRaw.summary, "personal-info.basics.summary"),
    email: asNullableString(basicsRaw.email, "personal-info.basics.email"),
    phone: asNullableString(basicsRaw.phone, "personal-info.basics.phone"),
    location:
      basicsRaw.location === undefined
        ? null
        : asNullableString(basicsRaw.location, "personal-info.basics.location"),
    website:
      basicsRaw.website === undefined
        ? null
        : asNullableString(basicsRaw.website, "personal-info.basics.website"),
  }

  const socials = (root.socials as unknown[]).map((item, index) => {
    const row = asRecord(item, `personal-info.socials[${index}]`)
    return {
      label: asString(row.label, `personal-info.socials[${index}].label`),
      href: asString(row.href, `personal-info.socials[${index}].href`),
    }
  })

  const skills = (root.skills as unknown[]).map((item, index) => {
    const row = asRecord(item, `personal-info.skills[${index}]`)
    return {
      title: asString(row.title, `personal-info.skills[${index}].title`),
      items: asStringArray(row.items, `personal-info.skills[${index}].items`),
    }
  })

  const focusAreas = asStringArray(root.focusAreas, "personal-info.focusAreas")

  const languages = (root.languages as unknown[]).map((item, index) => {
    const row = asRecord(item, `personal-info.languages[${index}]`)
    return {
      name: asString(row.name, `personal-info.languages[${index}].name`),
      proficiency: asString(
        row.proficiency,
        `personal-info.languages[${index}].proficiency`
      ),
    }
  })

  const experience: ExperienceItem[] = (root.experience as unknown[]).map(
    (item, index) => {
      const row = asRecord(item, `personal-info.experience[${index}]`)

      const roles: ExperienceRole[] = (row.roles as unknown[]).map(
        (roleItem, roleIndex) => {
          const role = asRecord(
            roleItem,
            `personal-info.experience[${index}].roles[${roleIndex}]`
          )

          return {
            title: asString(
              role.title,
              `personal-info.experience[${index}].roles[${roleIndex}].title`
            ),
            employmentType:
              role.employmentType === undefined
                ? undefined
                : asString(
                    role.employmentType,
                    `personal-info.experience[${index}].roles[${roleIndex}].employmentType`
                  ),
            location:
              role.location === undefined
                ? undefined
                : asString(
                    role.location,
                    `personal-info.experience[${index}].roles[${roleIndex}].location`
                  ),
            start: asMonthYear(
              role.start,
              `personal-info.experience[${index}].roles[${roleIndex}].start`
            ),
            end:
              role.end === undefined
                ? undefined
                : asMonthYear(
                    role.end,
                    `personal-info.experience[${index}].roles[${roleIndex}].end`
                  ),
            points: asStringArray(
              role.points,
              `personal-info.experience[${index}].roles[${roleIndex}].points`
            ),
            skills:
              role.skills === undefined
                ? undefined
                : asStringArray(
                    role.skills,
                    `personal-info.experience[${index}].roles[${roleIndex}].skills`
                  ),
          }
        }
      )

      return {
        org: asString(row.org, `personal-info.experience[${index}].org`),
        roles,
      }
    }
  )

  const education = (root.education as unknown[]).map((item, index) => {
    const row = asRecord(item, `personal-info.education[${index}]`)
    return {
      title: asString(row.title, `personal-info.education[${index}].title`),
      place: asString(row.place, `personal-info.education[${index}].place`),
      period: asString(row.period, `personal-info.education[${index}].period`),
      details: asStringArray(
        row.details,
        `personal-info.education[${index}].details`
      ),
    }
  })

  const projects = (root.projects as unknown[]).map((item, index) => {
    const row = asRecord(item, `personal-info.projects[${index}]`)
    return {
      title: asString(row.title, `personal-info.projects[${index}].title`),
      href: asString(row.href, `personal-info.projects[${index}].href`),
      summary: asString(
        row.summary,
        `personal-info.projects[${index}].summary`
      ),
    }
  })

  return {
    basics,
    socials,
    skills,
    focusAreas,
    languages,
    experience,
    education,
    projects,
    leadership: asStringArray(root.leadership, "personal-info.leadership"),
    certifications: asStringArray(
      root.certifications,
      "personal-info.certifications"
    ),
    awards: asStringArray(root.awards, "personal-info.awards"),
  }
}

export function monthDiff(start: MonthYear, end: MonthYear) {
  return (end.year - start.year) * 12 + (end.month - start.month)
}

export function durationInMonths(start: MonthYear, end?: MonthYear) {
  const now = new Date()
  const resolvedEnd = end ?? {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }

  return Math.max(1, monthDiff(start, resolvedEnd) + 1)
}

export function formatDuration(monthsTotal: number) {
  const years = Math.floor(monthsTotal / 12)
  const months = monthsTotal % 12
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? "s" : ""}`)
  }

  if (months > 0 || parts.length === 0) {
    parts.push(`${months} mo${months > 1 ? "s" : ""}`)
  }

  return parts.join(" ")
}

export function formatMonthYear(value: MonthYear) {
  return `${monthNames[value.month - 1]} ${value.year}`
}

export function formatRolePeriod(role: ExperienceRole) {
  const startLabel = formatMonthYear(role.start)
  const endLabel = role.end ? formatMonthYear(role.end) : "Present"
  const durationLabel = formatDuration(durationInMonths(role.start, role.end))

  return `${startLabel} - ${endLabel} · ${durationLabel}`
}

export function getExperienceTotalDuration(experience: ExperienceItem) {
  if (experience.roles.length === 0) return null

  const starts = experience.roles.map((role) => role.start)
  const earliestStart = starts.reduce((earliest, current) => {
    return monthDiff(current, earliest) > 0 ? current : earliest
  })

  const hasPresentRole = experience.roles.some((role) => !role.end)
  if (hasPresentRole) {
    return formatDuration(durationInMonths(earliestStart))
  }

  const ends = experience.roles
    .map((role) => role.end)
    .filter((value): value is MonthYear => Boolean(value))

  if (ends.length === 0) return formatDuration(durationInMonths(earliestStart))

  const latestEnd = ends.reduce((latest, current) => {
    return monthDiff(latest, current) > 0 ? current : latest
  })

  return formatDuration(durationInMonths(earliestStart, latestEnd))
}

export const personalInfo = parsePersonalInfo(rawPersonalInfo)
