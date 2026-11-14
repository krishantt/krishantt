import { Link } from "react-router-dom"

import { PostRow } from "@/components/post-row"
import { SectionHeading } from "@/components/section-heading"
import { getAllPosts } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { BOOKING_URL } from "@/lib/site"

export function HomePage() {
  const latestPosts = getAllPosts().slice(0, 4)

  usePageMetadata({
    description:
      "Krishant Timilsina is a software engineer in Pokhara, Nepal, working on platform and product engineering: cloud infrastructure, APIs, and the interfaces on top.",
  })

  return (
    <div className="flex flex-col">
      <section>
        <h1 className="voice text-[2rem] leading-[1.1] tracking-[-0.02em] text-balance sm:text-statement max-w-[24ch]">
          I build software that has to keep working after the interesting part is
          over.
        </h1>
        <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-muted-foreground sm:mt-7">
          Software engineer in Pokhara, Nepal. Most of my work is platform and
          product engineering: terraform, kubernetes, the API layer, and the
          interface on top of it.
        </p>

        <div className="rule mt-8 flex flex-col gap-2 pt-4 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="shrink-0 text-meta text-muted-foreground sm:w-9">
            Now
          </span>
          <p className="measure flex-1 text-[0.9375rem] leading-relaxed">
            Contract platform engineer at Lelapa AI. Open to new work.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="link shrink-0 text-[0.9375rem]"
          >
            Book a call
          </a>
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <SectionHeading
          title="Writing"
          action={
            <Link
              to="/blog"
              className="text-meta text-muted-foreground transition-colors hover:text-foreground"
            >
              All posts
            </Link>
          }
        />
        <ul className="mt-1">
          {latestPosts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ul>
      </section>
    </div>
  )
}
