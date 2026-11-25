import { Link, useSearchParams } from "react-router-dom"

import { PostRow } from "@/components/post-row"
import { getAllPosts } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import {
  canonicalTag,
  filterPostsByTag,
  getTagCounts,
  tagHref,
} from "@/lib/post-tools"

export function BlogIndexPage() {
  const allPosts = getAllPosts()
  const [searchParams] = useSearchParams()
  const rawTag = searchParams.get("tag")
  const activeTag = rawTag ? canonicalTag(allPosts, rawTag) : null
  const posts = filterPostsByTag(allPosts, activeTag)
  const tags = getTagCounts(allPosts)

  usePageMetadata({
    title: activeTag ? `Writing on ${activeTag}` : "Writing",
    description:
      "Articles on software engineering, systems design, and practical development lessons by Krishant Timilsina.",
  })

  return (
    <div>
      <h1 className="voice text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
        Writing
      </h1>
      <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground text-balance">
        Notes on software and systems, mostly about the parts that never make it
        into a README.
      </p>

      <nav
        aria-label="Filter by tag"
        className="mt-8 flex flex-wrap gap-x-4 gap-y-1.5 text-meta"
      >
        {tags.map(({ tag, count }) => {
          const isActive = tag === activeTag

          return (
            <Link
              key={tag}
              to={isActive ? "/blog" : tagHref(tag)}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-foreground underline decoration-border decoration-1 underline-offset-[0.35em]"
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {tag}
              <span className="ml-1 text-muted-foreground/70 tabular-nums">
                {count}
              </span>
            </Link>
          )
        })}
      </nav>

      {activeTag ? (
        <p className="mt-6 text-[0.9375rem] text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged{" "}
          <span className="text-foreground">{activeTag}</span>.{" "}
          <Link to="/blog" className="link">
            Show all
          </Link>
        </p>
      ) : null}

      <ul className={activeTag ? "mt-6" : "mt-10"}>
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} showSummary />
        ))}
      </ul>

      {posts.length === 0 ? (
        <p className="rule pt-5 text-[0.9375rem] text-muted-foreground">
          Nothing is tagged {activeTag} yet.
        </p>
      ) : null}
    </div>
  )
}
