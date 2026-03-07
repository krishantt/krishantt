import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const aboutSections = [
  {
    title: "Skills & Tech Stack",
    points: [
      "Languages: C/C++, Python, Dart, Go, JavaScript, TypeScript",
      "Frameworks: Django, Flutter, Next.js, React, Remix, HTMX, Alpine.js",
      "DevOps: Linux, Docker, Kubernetes",
    ],
  },
  {
    title: "Experience",
    points: [
      "Full Stack Web Developer at Lelapa AI (2024 - Present)",
      "Software Engineer at Himalayan Green Pvt. Ltd. (2024 - Present)",
      "Python Developer at Sandbox Software Pvt. Ltd. (2024)",
    ],
  },
]

export function AboutPage() {
  return (
    <Card className="bg-card/90">
      <CardHeader>
        <CardTitle className="text-2xl">Who am I?</CardTitle>
        <CardDescription>
          I love solving difficult product and engineering problems by combining
          thoughtful design, pragmatic architecture, and clear communication.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {aboutSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {section.points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
