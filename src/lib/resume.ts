import {
  formatRolePeriod,
  getExperienceTotalDuration,
  personalInfo,
} from "@/lib/personal-info"

function section(title: string, rows: string[]) {
  return `${title}\n${rows.join("\n")}`
}

export function buildResumeText() {
  const contactRows = [
    `Location: ${personalInfo.basics.location ?? "N/A"}`,
    `Email: ${personalInfo.basics.email ?? "N/A"}`,
    `Phone: ${personalInfo.basics.phone ?? "N/A"}`,
  ]

  const socialRows = personalInfo.socials.map(
    (social) => `- ${social.label}: ${social.href}`
  )

  const skillRows = personalInfo.skills.flatMap((group) => [
    `${group.title}: ${group.items.join(", ")}`,
  ])

  const languageRows = personalInfo.languages.map(
    (language) => `- ${language.name} (${language.proficiency})`
  )

  const experienceRows = personalInfo.experience.flatMap((item) => {
    const groupDuration =
      item.roles.length > 1 ? ` (${getExperienceTotalDuration(item)})` : ""

    return [
      `${item.org}${groupDuration}`,
      ...item.roles.flatMap((role) => {
        const roleMeta = [role.employmentType, role.location]
          .filter(Boolean)
          .join(" | ")
        const roleSkills = role.skills?.length
          ? [`    Skills: ${role.skills.join(", ")}`]
          : []

        return [
          `  - ${role.title} (${formatRolePeriod(role)})${roleMeta ? ` [${roleMeta}]` : ""}`,
          ...role.points.map((point) => `    * ${point}`),
          ...roleSkills,
        ]
      }),
    ]
  })

  const educationRows = personalInfo.education.flatMap((item) => [
    `${item.title} - ${item.place} (${item.period})`,
    ...item.details.map((detail) => `  * ${detail}`),
  ])

  const projectRows = personalInfo.projects.map(
    (project) => `- ${project.title}: ${project.summary} (${project.href})`
  )

  const output = [
    `${personalInfo.basics.name}`,
    `${personalInfo.basics.headline}`,
    "",
    personalInfo.basics.summary,
    "",
    section("CONTACT", contactRows),
    "",
    section("SOCIALS", socialRows),
    "",
    section(
      "FOCUS AREAS",
      personalInfo.focusAreas.map((item) => `- ${item}`)
    ),
    "",
    section("SKILLS", skillRows),
    "",
    section("LANGUAGES", languageRows),
    "",
    section("EXPERIENCE", experienceRows),
    "",
    section("EDUCATION", educationRows),
    "",
    section("PROJECTS", projectRows),
    "",
    section(
      "LEADERSHIP",
      personalInfo.leadership.map((item) => `- ${item}`)
    ),
    "",
    section(
      "CERTIFICATIONS",
      personalInfo.certifications.map((item) => `- ${item}`)
    ),
    "",
    section(
      "AWARDS",
      personalInfo.awards.map((item) => `- ${item}`)
    ),
    "",
  ]

  return output.join("\n")
}

export function downloadResume() {
  const text = buildResumeText()
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const blobUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  const isoDate = new Date().toISOString().slice(0, 10)

  anchor.href = blobUrl
  anchor.download = `krishant-timilsina-resume-${isoDate}.txt`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(blobUrl)
}
