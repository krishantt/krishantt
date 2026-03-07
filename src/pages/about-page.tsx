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

const experiences = [
  {
    role: "Full Stack Web Developer",
    org: "Lelapa AI",
    period: "Jan 2025 - Present",
    points: [
      "Built product interfaces with HTMX, Alpine.js, and React.",
      "Designed API key management for auth and access control.",
      "Contributed to technical roadmap decisions for platform delivery.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Himalayan Green Pvt. Ltd.",
    period: "Dec 2024 - Jan 2025",
    points: [
      "Built and maintained web and mobile experiences for himaligreen.com.",
    ],
  },
  {
    role: "Python Developer",
    org: "Sandbox Software Pvt. Ltd.",
    period: "Oct 2024 - Nov 2024",
    points: ["Automated business workflows with computer vision systems."],
  },
  {
    role: "Frontend Developer (Freelance)",
    org: "Lelapa AI",
    period: "Aug 2023 - Jan 2025",
    points: [
      "Developed demo applications in Next.js with AI features like transcription and translation.",
    ],
  },
  {
    role: "Design Intern",
    org: "Evakon Technologies",
    period: "Jun 2023 - Jul 2023",
    points: [
      "Contributed to multiple design projects and sharpened visual communication skills.",
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
              key={`${experience.role}-${experience.org}`}
              className="rounded-xl border border-border/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  {experience.role} @ {experience.org}
                </h3>
                <Badge variant="secondary">{experience.period}</Badge>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {experience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
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
