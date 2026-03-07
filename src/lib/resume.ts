import { jsPDF } from "jspdf"

import {
  formatRolePeriod,
  getExperienceTotalDuration,
  personalInfo,
} from "@/lib/personal-info"

type PdfCursor = {
  y: number
}

const PAGE_MARGIN = 16
const CONTENT_WIDTH = 178

function ensureSpace(doc: jsPDF, cursor: PdfCursor, requiredHeight: number) {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (cursor.y + requiredHeight <= pageHeight - PAGE_MARGIN) return

  doc.addPage()
  cursor.y = PAGE_MARGIN
}

function writeLine(
  doc: jsPDF,
  cursor: PdfCursor,
  text: string,
  size = 10,
  style: "normal" | "bold" = "normal",
  indent = 0
) {
  doc.setFont("helvetica", style)
  doc.setFontSize(size)

  const lineHeight = size <= 10 ? 5 : 6
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent)
  ensureSpace(doc, cursor, lines.length * lineHeight)
  doc.text(lines, PAGE_MARGIN + indent, cursor.y)
  cursor.y += lines.length * lineHeight
}

function writeGap(cursor: PdfCursor, amount = 3) {
  cursor.y += amount
}

function writeSectionTitle(doc: jsPDF, cursor: PdfCursor, title: string) {
  ensureSpace(doc, cursor, 12)
  writeLine(doc, cursor, title, 11, "bold")
  doc.setDrawColor(170)
  doc.setLineWidth(0.3)
  doc.line(
    PAGE_MARGIN,
    cursor.y - 4,
    PAGE_MARGIN + CONTENT_WIDTH,
    cursor.y - 4 
  )
  writeGap(cursor, 2)
}

function getRoleSkillsSummary(skills?: string[]) {
  if (!skills || skills.length === 0) return null
  if (skills.length <= 2) return skills.join(" and ")

  return `${skills[0]}, ${skills[1]}, and ${skills.length - 2} more`
}

function buildResumePdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const cursor: PdfCursor = { y: PAGE_MARGIN }

  writeLine(doc, cursor, personalInfo.basics.name, 18, "bold")
  writeLine(doc, cursor, personalInfo.basics.headline, 11)
  writeGap(cursor)

  const contact = [
    personalInfo.basics.location,
    personalInfo.basics.email,
    personalInfo.basics.phone,
    personalInfo.basics.website,
  ].filter(Boolean)
  if (contact.length > 0) {
    writeLine(doc, cursor, contact.join("  |  "), 9)
  }

  const socialsInline = personalInfo.socials
    .map((social) => `${social.label}: ${social.href}`)
    .join("  |  ")
  if (socialsInline) {
    writeLine(doc, cursor, socialsInline, 9)
  }

  writeGap(cursor)
  writeSectionTitle(doc, cursor, "PROFILE")
  writeLine(doc, cursor, personalInfo.basics.summary)

  writeGap(cursor)
  writeSectionTitle(doc, cursor, "SKILLS")
  personalInfo.skills.forEach((group) => {
    writeLine(doc, cursor, `${group.title}: ${group.items.join(", ")}`)
  })

  writeGap(cursor)
  writeSectionTitle(doc, cursor, "EXPERIENCE")
  personalInfo.experience.forEach((item) => {
    const groupDuration =
      item.roles.length > 1 ? ` (${getExperienceTotalDuration(item)})` : ""
    writeLine(doc, cursor, `${item.org}${groupDuration}`, 11, "bold")

    item.roles.forEach((role) => {
      const meta = [role.employmentType, role.location]
        .filter(Boolean)
        .join(" | ")
      const heading = `${role.title} | ${formatRolePeriod(role)}${meta ? ` | ${meta}` : ""}`
      writeLine(doc, cursor, heading, 10, "normal", 2)

      role.points.forEach((point) => {
        writeLine(doc, cursor, `- ${point}`, 10, "normal", 5)
      })

      const roleSkillsSummary = getRoleSkillsSummary(role.skills)
      if (roleSkillsSummary) {
        writeLine(doc, cursor, `Skills: ${roleSkillsSummary}`, 9, "normal", 5)
      }

      writeGap(cursor, 1)
    })

    writeGap(cursor, 1)
  })

  writeSectionTitle(doc, cursor, "EDUCATION")
  personalInfo.education.forEach((item) => {
    writeLine(doc, cursor, `${item.title} - ${item.place}`, 10, "bold")
    writeLine(doc, cursor, item.period, 9)

    item.details.forEach((detail) => {
      writeLine(doc, cursor, `- ${detail}`, 10, "normal", 3)
    })

    writeGap(cursor, 1)
  })

  writeGap(cursor)
  writeSectionTitle(doc, cursor, "PROJECTS")
  personalInfo.projects.forEach((project) => {
    writeLine(doc, cursor, project.title, 10, "bold")
    writeLine(doc, cursor, project.summary, 10, "normal", 3)
    writeLine(doc, cursor, project.href, 9, "normal", 3)
    writeGap(cursor, 1)
  })

  writeGap(cursor)
  writeSectionTitle(doc, cursor, "LEADERSHIP, CERTIFICATIONS & AWARDS")

  if (personalInfo.leadership.length > 0) {
    writeLine(doc, cursor, "Leadership", 10, "bold")
    personalInfo.leadership.forEach((item) => {
      writeLine(doc, cursor, `- ${item}`, 10, "normal", 3)
    })
    writeGap(cursor, 1)
  }

  if (personalInfo.certifications.length > 0) {
    writeLine(doc, cursor, "Certifications", 10, "bold")
    personalInfo.certifications.forEach((item) => {
      writeLine(doc, cursor, `- ${item}`, 10, "normal", 3)
    })
    writeGap(cursor, 1)
  }

  if (personalInfo.awards.length > 0) {
    writeLine(doc, cursor, "Awards", 10, "bold")
    personalInfo.awards.forEach((item) => {
      writeLine(doc, cursor, `- ${item}`, 10, "normal", 3)
    })
  }

  return doc
}

export function downloadResume() {
  const doc = buildResumePdf()
  const isoDate = new Date().toISOString().slice(0, 10)
  doc.save(`krishant-timilsina-resume-${isoDate}.pdf`)
}
