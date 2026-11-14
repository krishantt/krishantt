
import { ResumeDownload } from "@/components/resume-download"
import { SectionHeading } from "@/components/section-heading"
import {
  personalInfo,
} from "@/lib/personal-info"
import { usePageMetadata } from "@/lib/metadata"
import { BOOKING_URL } from "@/lib/site"
import type { ExperienceRole } from "@/types/personal-info"

function roleYears(role: ExperienceRole) {
  const start = role.start.year

  if (!role.end) {
    return `${start} – now`
  }

  return role.end.year === start
    ? `${start}`
    : `${start} – ${role.end.year}`
}

const flatRoles = personalInfo.experience.flatMap((experience) =>
  experience.roles.map((role) => ({ org: experience.org, role }))
)

// The data carries the full sentence for the résumé PDF; the page shows the part
// before the colon, which fits on one line.
const headline = (item: string) => item.split(": ")[0]

export function AboutPage() {

  usePageMetadata({
    title: "About",
    description: `Deep dive into ${personalInfo.basics.name}'s engineering experience, projects, education, leadership, and technical focus areas.`,
    markdownPath: "/about.md",
  })

  return (
    <div className="flex flex-col">
      <section>
        <h1 className="voice text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
          About
        </h1>
        <div className="mt-6 flex flex-col-reverse gap-8 sm:mt-7 sm:flex-row sm:items-start sm:justify-between">
          <p className="voice measure text-[1.1875rem] leading-[1.6] text-foreground">
            {personalInfo.basics.summary}
          </p>
          <img
            src="/images/profile.jpg"
            alt="Krishant Timilsina"
            width={112}
            height={112}
            className="size-24 shrink-0 rounded-sm border border-border object-cover grayscale transition-[filter] duration-300 hover:grayscale-0 sm:size-28"
          />
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]">
          <ResumeDownload />
          <a href={`mailto:${personalInfo.basics.email}`} className="link">
            {personalInfo.basics.email}
          </a>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Book a call
          </a>
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="Experience" />
        <ol>
          {flatRoles.map(({ org, role }) => (
            <li
              key={`${org}-${role.title}-${role.start.year}-${role.start.month}`}
              className="rule grid grid-cols-[5rem_1fr] gap-x-4 py-5 sm:grid-cols-[6rem_1fr] sm:gap-x-8"
            >
              <span className="pt-0.5 text-meta text-muted-foreground tabular-nums">
                {roleYears(role)}
              </span>
              <div>
                <h3 className="text-[0.9375rem] leading-snug font-medium">
                  {role.title}
                </h3>
                <p className="mt-1 text-meta text-muted-foreground">
                  {[org, role.employmentType, role.location]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-border">
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="Things I work with" />
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[7.5rem_1fr]">
          {personalInfo.skills.map((group) => (
            <div key={group.title} className="contents">
              <dt className="text-meta text-muted-foreground">
                {group.title}
              </dt>
              <dd className="text-[0.9375rem]">{group.items.join(", ")}</dd>
            </div>
          ))}
          <dt className="text-meta text-muted-foreground">Focus</dt>
          <dd className="text-[0.9375rem]">
            {personalInfo.focusAreas.join(", ")}
          </dd>
          <dt className="text-meta text-muted-foreground">Speaks</dt>
          <dd className="text-[0.9375rem]">
            {personalInfo.languages
              .map((language) => `${language.name} (${language.proficiency})`)
              .join(", ")}
          </dd>
        </dl>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="Education" />
        <ul>
          {personalInfo.education.map((item) => (
            <li key={item.title} className="rule py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[0.9375rem] font-medium">{item.title}</h3>
                <span className="text-meta text-muted-foreground tabular-nums">
                  {item.period}
                </span>
              </div>
              <p className="mt-1 text-meta text-muted-foreground">
                {item.place}
              </p>
              {item.details.length > 0 ? (
                <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-border">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="Selected projects" />
        <ul>
          {personalInfo.projects.map((project) => (
            <li key={project.title} className="rule py-5">
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="row-link text-[0.9375rem] font-medium underline decoration-foreground/20 decoration-1 underline-offset-4 hover:decoration-brand"
              >
                {project.title}
              </a>
              <p className="measure mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="Leadership, certifications and awards" />
        <div className="mt-5 flex flex-col gap-5">
          {[
            { title: "Leadership", items: personalInfo.leadership },
            { title: "Certifications", items: personalInfo.certifications },
            { title: "Awards", items: personalInfo.awards },
          ].map((group, index) => (
            <div
              key={group.title}
              className={index === 0 ? undefined : "rule pt-5"}
            >
              <h3 className="text-meta text-muted-foreground">
                {group.title}
              </h3>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed">
                {group.items.map((item) => (
                  <li key={item}>{headline(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
