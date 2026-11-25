import { Link } from "react-router-dom"

import { personalInfo } from "@/lib/personal-info"

const footerLinks = [
  { label: "Email", href: `mailto:${personalInfo.basics.email}` },
  { label: "GitHub", href: "https://github.com/krishantt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/krishtimil/" },
  { label: "Instagram", href: "https://www.instagram.com/krishtimil/" },
  { label: "Twitter", href: "https://twitter.com/krishtimill" },
  { label: "RSS", href: "/rss.xml" },
]

export function SiteFooter() {
  return (
    <footer className="shell mt-24 pb-14">
      <div className="rule flex flex-col gap-3 pt-6 text-[0.75rem] text-muted-foreground sm:flex-row sm:items-baseline sm:justify-between sm:text-meta">
        <p>© {new Date().getFullYear()} Krishant Timilsina</p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-5">
          {footerLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="transition-colors hover:text-foreground"
                {...(item.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground"
            >
              Résumé
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
