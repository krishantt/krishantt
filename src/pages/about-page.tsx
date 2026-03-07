import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePageMetadata } from "@/lib/metadata"

type ExperienceRole = {
  title: string
  start: { year: number; month: number }
  end?: { year: number; month: number }
  points: string[]
  type?: string
  location?: string
  skills?: string
}

type Experience = {
  org: string
  roles: ExperienceRole[]
}

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

function getNowMonthValue() {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

function monthDiff(
  start: { year: number; month: number },
  end: { year: number; month: number }
) {
  return (end.year - start.year) * 12 + (end.month - start.month)
}

function durationInMonths(
  start: { year: number; month: number },
  end?: { year: number; month: number }
) {
  const resolvedEnd = end ?? getNowMonthValue()

  return Math.max(1, monthDiff(start, resolvedEnd) + 1)
}

function formatDuration(monthsTotal: number) {
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

function formatMonthYear(value: { year: number; month: number }) {
  return `${monthNames[value.month - 1]} ${value.year}`
}

function formatRolePeriod(role: ExperienceRole) {
  const startLabel = formatMonthYear(role.start)
  const endLabel = role.end ? formatMonthYear(role.end) : "Present"
  const durationLabel = formatDuration(durationInMonths(role.start, role.end))

  return `${startLabel} - ${endLabel} · ${durationLabel}`
}

function getExperienceTotalDuration(experience: Experience) {
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
    .filter((value): value is { year: number; month: number } => Boolean(value))

  if (ends.length === 0) return formatDuration(durationInMonths(earliestStart))

  const latestEnd = ends.reduce((latest, current) => {
    return monthDiff(latest, current) > 0 ? current : latest
  })

  return formatDuration(durationInMonths(earliestStart, latestEnd))
}

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "TypeScript / JavaScript", "Go", "C/C++", "SQL", "Bash"],
  },
  {
    title: "Frameworks",
    items: ["FastAPI", "Django", "React", "Next.js", "HTMX", "Alpine.js"],
  },
  {
    title: "DevOps",
    items: [
      "Linux",
      "Docker",
      "Kubernetes",
      "OpenShift",
      "ArgoCD (GitOps)",
      "Gateway API",
      "CI/CD pipelines",
      "Caddy",
    ],
  },
]

const focusAreas = [
  "Platform Engineering",
  "Kubernetes & Cloud-Native Infrastructure",
  "Distributed Systems Architecture",
]

const experiences: Experience[] = [
  {
    org: "Lelapa AI",
    roles: [
      {
        title: "Full Stack Developer",
        type: "Contract",
        start: { year: 2025, month: 1 },
        location: "Remote",
        points: [
          "Deliver full solutions end-to-end that build on Lelapa's existing products and technical estate.",
          "Introduce and implement unit and functional testing to uphold platform quality.",
          "Communicate technical decisions and key implementation details with the team.",
          "Collaborate with engineers and the product manager to deliver high-value work for the business and customers.",
        ],
        skills: "Django, Amazon Web Services (AWS), and 4 more",
      },
      {
        title: "Frontend Developer",
        type: "Freelance",
        start: { year: 2024, month: 8 },
        end: { year: 2024, month: 12 },
        points: [
          "Design and develop intuitive user interfaces for API key generation, rotation, and access control.",
          "Implement secure authentication and authorization flows for API key management.",
          "Co-manage platform delivery by proposing approaches and identifying key technical factors.",
        ],
        skills: "Django and React.js",
      },
    ],
  },
]

const education = [
  {
    title: "Bachelor of Engineering, Computer Science",
    place: "Pulchowk Campus",
    period: "2022 - Present",
    details: [
      "Minor project: building a serverless platform.",
      "Ranked in the top 0.8% among 13,000 entrance applicants.",
    ],
  },
  {
    title: "Grade 11/12, Science",
    place: "SOS Herman Gmeiner Secondary School Gandaki",
    period: "GPA: 3.54/4",
    details: [],
  },
  {
    title: "SEE",
    place: "Global Collegiate School",
    period: "GPA: 3.85/4",
    details: [],
  },
]

const projects = [
  {
    title: "Voxel Engine",
    href: "https://github.com/krishantt/voxel_engine",
    summary:
      "Minecraft-inspired engine for rendering 3D worlds with efficient voxel meshing.",
  },
  {
    title: "Binary Plan MLM",
    href: "https://github.com/krishantt/binary-plan-mlm",
    summary:
      "Network marketing tree simulation using algorithmic structures such as AVL Trees and Kruskal's.",
  },
  {
    title: "Chess",
    href: "https://github.com/bigya_01/chess_rl",
    summary:
      "Multiplayer chess with AI-backed logic and a custom interface built with SMFL graphics.",
  },
  {
    title: "Agrify",
    href: "https://github.com/krishtimil/agrify",
    summary:
      "Flutter application built to simplify day-to-day work for farmers.",
  },
]

const leadership = [
  "Coordinator @ PDSC (Aug 2022 - Present): Led a team of 50 and organized workshops for 300+ attendees.",
  "Technical Lead @ IEEE Pulchowk (Apr 2024 - Dec 2024): Managed technical execution for club initiatives.",
  "Graphics Lead @ Hult Prize IOE (Sep 2023 - Apr 2024): Designed event visuals and communication assets.",
]

const certifications = [
  "Microdegree in AI & Machine Learning - Fusemachines",
  "Azure AI Fundamentals - Microsoft",
]

const awards = [
  "Best Presentation Award, Mobile Reuse Hackathon: Built a smart assistant for visually impaired users using old phones.",
  "2nd Runner-Up, MBM Ideax Hackathon: Built a platform preserving languages through community stories.",
]

export function AboutPage() {
  usePageMetadata({
    title: "About",
    description:
      "Deep dive into Krishant Timilsina's engineering experience, projects, education, leadership, and technical focus areas.",
  })

  return (
    <section className="flex flex-col gap-4">
      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            About me
          </Badge>
          <CardTitle className="text-2xl">Who am I?</CardTitle>
          <CardDescription className="max-w-3xl text-sm">
            I am a software engineer who loves turning complex ideas into
            practical products. I work across full-stack systems, AI-driven
            tooling, and developer experience, with a strong bias for clarity,
            shipping, and long-term maintainability.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">Skills & Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {skillGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">Current Focus</CardTitle>
            <CardDescription>
              Themes I actively explore and build around.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {focusAreas.map((focus) => (
              <Badge key={focus}>{focus}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl">Experience</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {experiences.map((experience) => (
            <div
              key={experience.org}
              className="rounded-xl border border-border/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{experience.org}</h3>
                {experience.roles.length > 1 ? (
                  <Badge variant="secondary">
                    {getExperienceTotalDuration(experience)}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3 space-y-3">
                {experience.roles.map((role) => (
                  <div
                    key={`${experience.org}-${role.title}-${formatMonthYear(role.start)}`}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-medium">{role.title}</h4>
                      <Badge variant="outline">{formatRolePeriod(role)}</Badge>
                    </div>
                    {role.type || role.location ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[role.type, role.location].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {role.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    {role.skills ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {role.skills}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 p-4"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.place}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.period}
                </p>
                {item.details.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">
              Leadership, Certifications & Awards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Leadership</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {leadership.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Certifications</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Awards</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {awards.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl">Selected Projects</CardTitle>
          <CardDescription>
            A few projects spanning systems, algorithms, and product interfaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.title} size="sm" className="bg-background/70">
              <CardHeader>
                <CardTitle className="text-base">{project.title}</CardTitle>
                <CardDescription>{project.summary}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <a href={project.href} target="_blank" rel="noreferrer">
                    View project
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
