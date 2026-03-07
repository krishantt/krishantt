import { jsPDF } from "jspdf"

import {
  formatRolePeriod,
  getExperienceTotalDuration,
  personalInfo,
} from "@/lib/personal-info"

type PdfCursor = { y: number }
type FontStyle = "normal" | "bold" | "italic"

const PAGE_MARGIN = 14
const CONTENT_WIDTH = 182
const RIGHT_COLUMN_WIDTH = 40
const COLUMN_GAP = 4
const LEFT_COLUMN_WIDTH = CONTENT_WIDTH - RIGHT_COLUMN_WIDTH - COLUMN_GAP

const BLACK: [number, number, number] = [0, 0, 0]
const GRAY: [number, number, number] = [70, 70, 70]
const LIGHT_GRAY: [number, number, number] = [150, 150, 150]

function ensureSpace(doc: jsPDF, cursor: PdfCursor, heightNeeded: number) {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (cursor.y + heightNeeded <= pageHeight - PAGE_MARGIN) return

  doc.addPage()
  cursor.y = PAGE_MARGIN
}

function splitLines(doc: jsPDF, text: string, maxWidth: number) {
  if (!text) return [""]
  return doc.splitTextToSize(text, maxWidth) as string[]
}

function setFont(doc: jsPDF, size: number, style: FontStyle, color = BLACK) {
  doc.setFont("times", style)
  doc.setFontSize(size)
  doc.setTextColor(...color)
}

function writeLeft(
  doc: jsPDF,
  cursor: PdfCursor,
  text: string,
  opts: {
    size?: number
    style?: FontStyle
    color?: [number, number, number]
    indent?: number
    lineHeight?: number
  } = {}
) {
  const {
    size = 10,
    style = "normal",
    color = BLACK,
    indent = 0,
    lineHeight = size <= 9.5 ? 4.2 : 4.8,
  } = opts

  setFont(doc, size, style, color)
  const lines = splitLines(doc, text, CONTENT_WIDTH - indent)
  ensureSpace(doc, cursor, lines.length * lineHeight)
  doc.text(lines, PAGE_MARGIN + indent, cursor.y)
  cursor.y += lines.length * lineHeight
}

function writeCentered(
  doc: jsPDF,
  cursor: PdfCursor,
  text: string,
  opts: {
    size?: number
    style?: FontStyle
    color?: [number, number, number]
    maxWidth?: number
    lineHeight?: number
  } = {}
) {
  const {
    size = 10,
    style = "normal",
    color = BLACK,
    maxWidth = CONTENT_WIDTH,
    lineHeight = size <= 10 ? 4.4 : 5.3,
  } = opts

  setFont(doc, size, style, color)
  const lines = splitLines(doc, text, maxWidth)
  ensureSpace(doc, cursor, lines.length * lineHeight)

  const centerX = PAGE_MARGIN + CONTENT_WIDTH / 2
  lines.forEach((line, index) => {
    doc.text(line, centerX, cursor.y + index * lineHeight, { align: "center" })
  })

  cursor.y += lines.length * lineHeight
}

function writeSectionTitle(doc: jsPDF, cursor: PdfCursor, title: string) {
  ensureSpace(doc, cursor, 8)
  setFont(doc, 10.5, "bold", BLACK)
  doc.text(title.toUpperCase(), PAGE_MARGIN, cursor.y)

  const titleWidth = doc.getTextWidth(title.toUpperCase())
  const lineStart = PAGE_MARGIN + titleWidth + 4
  doc.setDrawColor(...LIGHT_GRAY)
  doc.setLineWidth(0.25)
  doc.line(
    lineStart,
    cursor.y - 1.4,
    PAGE_MARGIN + CONTENT_WIDTH,
    cursor.y - 1.4
  )

  cursor.y += 4.8
}

function drawRightColumn(
  doc: jsPDF,
  yStart: number,
  lines: string[],
  opts: {
    size?: number
    style?: FontStyle
    color?: [number, number, number]
  } = {}
) {
  const { size = 9, style = "normal", color = GRAY } = opts
  const lineHeight = size <= 9 ? 4 : 4.5

  setFont(doc, size, style, color)

  let y = yStart
  lines.forEach((raw) => {
    const wrapped = splitLines(doc, raw, RIGHT_COLUMN_WIDTH)
    wrapped.forEach((line) => {
      const textWidth = doc.getTextWidth(line)
      const x = PAGE_MARGIN + CONTENT_WIDTH - textWidth
      doc.text(line, x, y)
      y += lineHeight
    })
  })

  return y - yStart
}

function measureRightColumnHeight(
  doc: jsPDF,
  lines: string[],
  opts: {
    size?: number
    style?: FontStyle
    color?: [number, number, number]
  } = {}
) {
  const { size = 9, style = "normal", color = GRAY } = opts
  const lineHeight = size <= 9 ? 4 : 4.5

  setFont(doc, size, style, color)

  let height = 0
  lines.forEach((raw) => {
    const wrapped = splitLines(doc, raw, RIGHT_COLUMN_WIDTH)
    height += wrapped.length * lineHeight
  })

  return height
}

function drawExperienceBlock(
  doc: jsPDF,
  cursor: PdfCursor,
  roleTitle: string,
  company: string,
  rightLines: string[],
  bullets: string[],
  skills?: string[]
) {
  const leftX = PAGE_MARGIN
  const leftTop = cursor.y

  setFont(doc, 10.2, "bold", BLACK)
  const titleLines = splitLines(
    doc,
    `${roleTitle} - ${company}`,
    LEFT_COLUMN_WIDTH
  )
  const titleHeight = titleLines.length * 4.8

  setFont(doc, 9.4, "normal", GRAY)
  const bulletsHeights = bullets.reduce((acc, bullet) => {
    const wrapped = splitLines(doc, `- ${bullet}`, LEFT_COLUMN_WIDTH - 4)
    return acc + wrapped.length * 4.4
  }, 0)

  const skillsText =
    skills && skills.length > 0 ? `Skills: ${skills.join(", ")}` : undefined
  const skillsHeight = skillsText
    ? splitLines(doc, skillsText, LEFT_COLUMN_WIDTH - 4).length * 4.2
    : 0

  const rightHeight = measureRightColumnHeight(doc, rightLines)
  const headerHeight = Math.max(titleHeight, rightHeight)
  const totalHeight = headerHeight + bulletsHeights + skillsHeight + 4

  ensureSpace(doc, cursor, totalHeight)

  setFont(doc, 10.2, "bold", BLACK)
  doc.text(titleLines, leftX, leftTop)
  drawRightColumn(doc, leftTop, rightLines)

  cursor.y = leftTop + headerHeight + 0.8

  bullets.forEach((bullet) => {
    writeLeft(doc, cursor, `- ${bullet}`, {
      size: 9.5,
      indent: 2,
      lineHeight: 4.4,
    })
  })

  if (skillsText) {
    writeLeft(doc, cursor, skillsText, {
      size: 9,
      style: "italic",
      color: GRAY,
      indent: 2,
      lineHeight: 4.2,
    })
  }

  cursor.y += 1.1
}

function writeHeader(doc: jsPDF, cursor: PdfCursor) {
  writeCentered(doc, cursor, personalInfo.basics.name, {
    size: 26,
    style: "bold",
    lineHeight: 7,
  })
  writeCentered(doc, cursor, personalInfo.basics.headline, {
    size: 10.5,
    style: "normal",
    color: GRAY,
    lineHeight: 4.8,
  })

  const connections = [
    personalInfo.basics.location,
    personalInfo.basics.email,
    personalInfo.basics.phone,
    personalInfo.basics.website,
    ...personalInfo.socials.map((social) => social.href),
  ].filter(Boolean)

  if (connections.length > 0) {
    writeCentered(doc, cursor, connections.join(" • "), {
      size: 9,
      style: "normal",
      color: GRAY,
      lineHeight: 4.2,
    })
  }

  cursor.y += 1.5
}

function writeSummaryAndSkills(doc: jsPDF, cursor: PdfCursor) {
  writeSectionTitle(doc, cursor, "Professional Summary")
  writeLeft(doc, cursor, personalInfo.basics.summary, {
    size: 10,
    lineHeight: 4.8,
  })

  cursor.y += 1.2
  writeSectionTitle(doc, cursor, "Skills")

  if (personalInfo.focusAreas.length > 0) {
    writeLeft(
      doc,
      cursor,
      `Focus Areas: ${personalInfo.focusAreas.join(" | ")}`,
      {
        size: 9.5,
        color: GRAY,
        lineHeight: 4.4,
      }
    )
  }

  if (personalInfo.languages.length > 0) {
    const languageLine = personalInfo.languages
      .map((lang) => `${lang.name} (${lang.proficiency})`)
      .join(" | ")
    writeLeft(doc, cursor, `Languages: ${languageLine}`, {
      size: 9.5,
      color: GRAY,
      lineHeight: 4.4,
    })
  }

  personalInfo.skills.forEach((group) => {
    writeLeft(doc, cursor, `${group.title}: ${group.items.join(", ")}`, {
      size: 9.8,
      lineHeight: 4.5,
    })
  })
}

function writeExperience(doc: jsPDF, cursor: PdfCursor) {
  cursor.y += 1
  writeSectionTitle(doc, cursor, "Experience")

  personalInfo.experience.forEach((item) => {
    if (item.roles.length > 1) {
      writeLeft(
        doc,
        cursor,
        `${item.org} (${getExperienceTotalDuration(item)})`,
        {
          size: 10.2,
          style: "bold",
          lineHeight: 4.8,
        }
      )
    }

    item.roles.forEach((role) => {
      const rightLines = [role.location ?? "", formatRolePeriod(role)].filter(
        Boolean
      )

      drawExperienceBlock(
        doc,
        cursor,
        role.title,
        item.org,
        rightLines,
        role.points,
        role.skills
      )
    })
  })
}

function writeEducation(doc: jsPDF, cursor: PdfCursor) {
  cursor.y += 0.5
  writeSectionTitle(doc, cursor, "Education")

  personalInfo.education.forEach((item) => {
    const yStart = cursor.y

    setFont(doc, 10.2, "bold", BLACK)
    const institutionLines = splitLines(doc, item.place, LEFT_COLUMN_WIDTH)
    const institutionHeight = institutionLines.length * 4.8

    setFont(doc, 9.6, "italic", BLACK)
    const degreeLines = splitLines(doc, item.title, LEFT_COLUMN_WIDTH)
    const degreeHeight = degreeLines.length * 4.5

    const detailsHeight = item.details.reduce((acc, detail) => {
      const wrapped = splitLines(doc, `- ${detail}`, LEFT_COLUMN_WIDTH - 3)
      return acc + wrapped.length * 4.2
    }, 0)

    const rightHeight = measureRightColumnHeight(doc, [item.period])
    const blockHeight =
      Math.max(institutionHeight + degreeHeight, rightHeight) +
      detailsHeight +
      2

    ensureSpace(doc, cursor, blockHeight)

    setFont(doc, 10.2, "bold", BLACK)
    doc.text(institutionLines, PAGE_MARGIN, yStart)
    setFont(doc, 9.6, "italic", BLACK)
    doc.text(degreeLines, PAGE_MARGIN, yStart + institutionHeight)
    drawRightColumn(doc, yStart, [item.period])

    cursor.y =
      yStart + Math.max(institutionHeight + degreeHeight, rightHeight) + 0.6

    item.details.forEach((detail) => {
      writeLeft(doc, cursor, `- ${detail}`, {
        size: 9.3,
        indent: 2,
        lineHeight: 4.2,
      })
    })

    cursor.y += 0.8
  })
}

function writeProjects(doc: jsPDF, cursor: PdfCursor) {
  cursor.y += 0.5
  writeSectionTitle(doc, cursor, "Projects")

  personalInfo.projects.forEach((project) => {
    writeLeft(doc, cursor, project.title, {
      size: 10,
      style: "bold",
      lineHeight: 4.7,
    })
    writeLeft(doc, cursor, project.summary, {
      size: 9.5,
      indent: 2,
      color: GRAY,
      lineHeight: 4.3,
    })
    writeLeft(doc, cursor, project.href, {
      size: 9,
      indent: 2,
      style: "italic",
      color: GRAY,
      lineHeight: 4.2,
    })
    cursor.y += 0.8
  })
}

function writeSimpleSection(
  doc: jsPDF,
  cursor: PdfCursor,
  title: string,
  items: string[]
) {
  cursor.y += 0.5
  writeSectionTitle(doc, cursor, title)
  items.forEach((item) => {
    writeLeft(doc, cursor, `- ${item}`, {
      size: 9.4,
      lineHeight: 4.2,
    })
  })
}

function addPageNumbers(doc: jsPDF) {
  const totalPages = doc.getNumberOfPages()
  if (totalPages <= 1) return

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    setFont(doc, 8, "normal", GRAY)
    doc.text(
      `Page ${page} of ${totalPages}`,
      PAGE_MARGIN + CONTENT_WIDTH,
      doc.internal.pageSize.getHeight() - 6,
      { align: "right" }
    )
  }
}

function buildResumePdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const cursor: PdfCursor = { y: PAGE_MARGIN }

  writeHeader(doc, cursor)
  writeSummaryAndSkills(doc, cursor)
  writeExperience(doc, cursor)
  writeEducation(doc, cursor)
  writeProjects(doc, cursor)
  writeSimpleSection(doc, cursor, "Leadership", personalInfo.leadership)
  writeSimpleSection(doc, cursor, "Certifications", personalInfo.certifications)
  writeSimpleSection(doc, cursor, "Awards", personalInfo.awards)
  addPageNumbers(doc)

  return doc
}

export function downloadResume() {
  const doc = buildResumePdf()
  const isoDate = new Date().toISOString().slice(0, 10)
  doc.save(`krishant-timilsina-resume-${isoDate}.pdf`)
}
