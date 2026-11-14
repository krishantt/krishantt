import { Link } from "react-router-dom"

import { usePageMetadata } from "@/lib/metadata"

export function NotFoundPage() {
  usePageMetadata({
    title: "Page not found",
    description:
      "The page you are looking for does not exist. Return home to continue browsing.",
  })

  return (
    <div>
      <h1 className="voice text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
        This page does not exist
      </h1>
      <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
        The link may be out of date. The writing and the rest of the site are one
        click away.
      </p>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[0.9375rem]">
        <Link to="/" className="link">
          Home
        </Link>
        <Link to="/blog" className="link">
          Writing
        </Link>
      </p>
    </div>
  )
}
