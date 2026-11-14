import { Fragment } from "react"
import { Link } from "react-router-dom"

import { PostRow } from "@/components/post-row"
import { SectionHeading } from "@/components/section-heading"
import { getAllPosts } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { personalInfo } from "@/lib/personal-info"

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
          interface on top of it. I am currently on contract with Lelapa AI.
        </p>
        <p className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[0.9375rem]">
          <Link to="/about" className="link">
            More about me
          </Link>
          <a href={`mailto:${personalInfo.basics.email}`} className="link">
            {personalInfo.basics.email}
          </a>
        </p>
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

      <section className="mt-16 sm:mt-20">
        <SectionHeading title="What I work with" />
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[7.5rem_1fr]">
          {personalInfo.skills.map((group) => (
            <Fragment key={group.title}>
              <dt className="text-meta text-muted-foreground">
                {group.title}
              </dt>
              <dd className="text-[0.9375rem] text-foreground">
                {group.items.join(", ")}
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>
    </div>
  )
}
