import type { ReactNode } from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  AboutPage,
  BlogIndexPage,
  BlogPostPage,
  HomePage,
  NotFoundPage,
} from "@/pages"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
]

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
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,--theme(--color-primary/10),transparent_45%),radial-gradient(circle_at_80%_20%,--theme(--color-chart-2/20),transparent_35%)]" />
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
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  )
}

export default App
