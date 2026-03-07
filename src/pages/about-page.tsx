import { Download } from "lucide-react"
import { useState } from "react"

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
import {
  formatRolePeriod,
  getExperienceTotalDuration,
  personalInfo,
} from "@/lib/personal-info"
import { usePageMetadata } from "@/lib/metadata"

export function AboutPage() {
  const [isDownloadingResume, setIsDownloadingResume] = useState(false)

  const handleDownloadResume = async () => {
    if (isDownloadingResume) return

    setIsDownloadingResume(true)

    try {
      const { downloadResume } = await import("@/lib/resume")
      await downloadResume()
    } finally {
      setIsDownloadingResume(false)
    }
  }

  usePageMetadata({
    title: "About",
    description: `Deep dive into ${personalInfo.basics.name}'s engineering experience, projects, education, leadership, and technical focus areas.`,
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
            {personalInfo.basics.summary}
          </CardDescription>
          <Button
            size="sm"
            className="mt-2 w-fit"
            onClick={() => void handleDownloadResume()}
            disabled={isDownloadingResume}
          >
            <Download className="size-4" />
            {isDownloadingResume ? "Preparing PDF..." : "Download Resume"}
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl">Skills & Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {personalInfo.skills.map((group) => (
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
            <CardTitle className="text-xl">Focus & Languages</CardTitle>
            <CardDescription>
              Themes I actively explore and languages I work in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Current Focus</h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.focusAreas.map((focus) => (
                  <Badge key={focus}>{focus}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.languages.map((language) => (
                  <Badge key={language.name} variant="secondary">
                    {language.name} ({language.proficiency})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl">Experience</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {personalInfo.experience.map((experience) => (
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
                    key={`${experience.org}-${role.title}-${role.start.year}-${role.start.month}`}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-medium">{role.title}</h4>
                      <Badge variant="outline">{formatRolePeriod(role)}</Badge>
                    </div>
                    {role.employmentType || role.location ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[role.employmentType, role.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {role.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    {role.skills && role.skills.length > 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {role.skills.join(", ")}
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
            {personalInfo.education.map((item) => (
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
                {personalInfo.leadership.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Certifications</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {personalInfo.certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Awards</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {personalInfo.awards.map((item) => (
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
          {personalInfo.projects.map((project) => (
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
