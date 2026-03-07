import type { ReactNode } from "react"
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { getAllPosts, getPostBySlug } from "@/lib/blog"

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/krishtimil/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/krishtimil/" },
  { label: "GitHub", href: "https://github.com/krishantt" },
  { label: "Twitter", href: "https://twitter.com/krishtimill" },
]

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
]

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getResolvedTheme(theme: "dark" | "light" | "system") {
  if (theme !== "system") {
    return theme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function ThemeSwitcherButton() {
  const { theme, setTheme } = useTheme()
  const resolvedTheme = getResolvedTheme(theme)
  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-8 rounded-full"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 0 1 12 3" />
        </svg>
      )}
    </Button>
  )
}

function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,theme(colors.primary/10),transparent_45%),radial-gradient(circle_at_80%_20%,theme(colors.chart-2/20),transparent_35%)]" />
      <header className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-6">
        <Link to="/" className="flex items-center gap-3 self-start">
          <Avatar size="default" className="md:h-10 md:w-10">
            <AvatarImage src="/images/profile.jpg" alt="Krishant Timilsina" />
            <AvatarFallback>KT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Krishant Timilsina</span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Software Engineer
            </span>
          </div>
        </Link>
        <nav className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-border/80 bg-card/70 px-2 py-1.5 whitespace-nowrap backdrop-blur md:w-auto md:gap-2 md:px-3">
          {navLinks.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link to={item.href}>{item.label}</Link>
            </Button>
          ))}
          <ThemeSwitcherButton />
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 md:px-6">
        {children}
      </main>
    </div>
  )
}

function HomePage() {
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

function AboutPage() {
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

function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
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
  )
}

function BlogPostPage() {
  const { slug } = useParams()

  if (!slug) {
    return <Navigate to="/blog" replace />
  }

  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Post not found</CardTitle>
          <CardDescription>
            We could not find that article. Check the URL or go back to the blog
            index.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/blog">Back to blog</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl leading-tight font-semibold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(post.date)} • {post.readingTimeMinutes} min read
        </p>
      </header>
      <Card className="bg-card/90">
        <CardContent className="prose-content pt-4">
          <post.Content />
        </CardContent>
      </Card>
    </article>
  )
}

function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page not found</CardTitle>
        <CardDescription>
          The page does not exist anymore. Try the home page.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to="/">Go home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
