import { Link } from "react-router-dom"

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
import { getAllPosts } from "@/lib/blog"
import { formatDate } from "@/utils/format-date"

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/krishtimil/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/krishtimil/" },
  { label: "GitHub", href: "https://github.com/krishantt" },
  { label: "Twitter", href: "https://twitter.com/krishtimill" },
]

export function HomePage() {
  const latestPosts = getAllPosts().slice(0, 2)

  return (
    <>
      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            Building on the web
          </Badge>
          <CardTitle className="text-2xl">Hi, I&apos;m Krishant</CardTitle>
          <CardDescription className="max-w-xl text-sm">
            Creative software engineer crafting impactful solutions with code. I
            work across full-stack product engineering and DevOps-first systems.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/docs/resume.pdf" target="_blank" rel="noreferrer">
              Resume
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://calendar.app.google/k5gRRtwjw6TwwYCn8"
              target="_blank"
              rel="noreferrer"
            >
              Let&apos;s Collaborate
            </a>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {socialLinks.map((item) => (
            <Button key={item.label} asChild variant="ghost" size="sm">
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            </Button>
          ))}
        </CardFooter>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest from the blog</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/blog">View all</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {latestPosts.map((post) => (
            <Card key={post.slug} size="sm">
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>{post.summary}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(post.date)}</span>
                <span>{post.readingTimeMinutes} min read</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
