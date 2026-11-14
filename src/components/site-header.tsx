import { Link, useLocation } from "react-router-dom"

import { MachhapuchhreRidge } from "@/components/machhapuchhre-ridge"
import { useTheme } from "@/components/theme-provider"

const navLinks = [
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/about" },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-[1.05rem] translate-y-[0.1rem]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-[1.05rem] translate-y-[0.1rem]"
          aria-hidden="true"
        >
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  )
}

export function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="w-full">
      <div className="shell flex items-baseline justify-between gap-6 pt-10 sm:pt-14">
        <Link
          to="/"
          className="voice text-[1.0625rem] leading-none tracking-tight"
        >
          Krishant Timilsina
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-baseline gap-5 text-meta"
        >
          {navLinks.map((item) => {
            const isCurrent = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "text-foreground underline decoration-border decoration-1 underline-offset-[0.35em]"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            )
          })}
          <ThemeToggle />
        </nav>
      </div>

      <div className="mt-7 sm:mt-9">
        <MachhapuchhreRidge />
        <div className="shell">
          <p className="mt-1.5 text-right text-[0.6875rem] leading-none text-muted-foreground">
            Machhapuchhre, 6,993 m, seen from Pokhara
          </p>
        </div>
      </div>
    </header>
  )
}
