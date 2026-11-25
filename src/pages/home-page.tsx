import { Link } from "react-router-dom"

import { PostRow } from "@/components/post-row"
import { ResumeDownload } from "@/components/resume-download"
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
        <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-muted-foreground text-balance sm:mt-7">
          Software engineer at{" "}
          <a
            href="https://lelapa.ai"
            target="_blank"
            rel="noreferrer"
            className="link whitespace-nowrap"
          >
            Lelapa AI
          </a>
          . Based in Pokhara, Nepal.
        </p>
        <p className="measure mt-2 text-[1.0625rem] leading-relaxed text-balance">
          Ask me about migrations, retries, and the cutover nobody blogs about.
        </p>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[0.9375rem]">
          <ResumeDownload />
          <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="link">
            Book a call
          </a>
        </p>
      </section>

      <section className="mt-14 sm:mt-16">
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
