import { useCallback, useState, type ComponentType } from "react"
import { Link, Navigate, useParams } from "react-router-dom"

import { mdxComponents } from "@/components/mdx-components"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { personalInfo } from "@/lib/personal-info"
import { getAdjacentPosts, tagHref } from "@/lib/post-tools"
import { formatDate } from "@/utils/format-date"

export function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([])

  // The headings only exist once MDX has rendered, so read them off the DOM.
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    setHeadings(
      Array.from(node.querySelectorAll("h2[id]")).map((heading) => ({
        id: heading.id,
        // The trailing "#" anchor is not part of the title.
        text: (heading.firstChild?.textContent ?? heading.textContent ?? "").trim(),
      }))
    )
  }, [])

  usePageMetadata(
    post
      ? {
          title: post.title,
          description: post.summary,
          markdownPath: `/blog/${post.slug}.md`,
          path: `/blog/${post.slug}`,
          image: `https://krishant.com.np/og/${post.slug}.png`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            datePublished: post.date,
            image: `https://krishant.com.np/og/${post.slug}.png`,
            keywords: post.tags.join(", "),
            author: {
              "@type": "Person",
              name: "Krishant Timilsina",
              url: "https://krishant.com.np/",
            },
            url: `https://krishant.com.np/blog/${post.slug}`,
          },
        }
      : {
          title: "Post not found",
          description:
            "The requested post could not be found. Explore other articles on the blog.",
        }
  )

  if (!slug) {
    return <Navigate to="/blog" replace />
  }

  if (!post) {
    return (
      <div>
        <h1 className="voice text-[2rem] leading-[1.1] tracking-[-0.02em] sm:text-[2.5rem]">
          Post not found
        </h1>
        <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
          There is no article at this address. Everything I have published is
          listed on the writing page.
        </p>
        <p className="mt-6 text-[0.9375rem]">
          <Link to="/blog" className="link">
            All writing
          </Link>
        </p>
      </div>
    )
  }

  const { newer, older } = getAdjacentPosts(getAllPosts(), post.slug)
  const showContents = headings.length >= 4
  // MDX content accepts a `components` map; BlogPost types it as a bare component.
  const Content = post.Content as ComponentType<{
    components?: typeof mdxComponents
  }>

  return (
    <article>
      <header>
        <h1 className="voice text-[1.875rem] leading-[1.15] tracking-[-0.02em] text-balance sm:text-[2.25rem]">
          {post.title}
        </h1>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-meta text-muted-foreground tabular-nums">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTimeMinutes} min read</span>
          <span>
            {post.tags.map((tag, index) => (
              <span key={tag}>
                {index > 0 ? ", " : null}
                <Link
                  to={tagHref(tag)}
                  className="transition-colors hover:text-foreground"
                >
                  {tag}
                </Link>
              </span>
            ))}
          </span>
        </p>
      </header>

      {showContents ? (
        <nav aria-label="Contents" className="measure mt-10 text-meta">
          <p className="text-muted-foreground">Contents</p>
          <ol className="mt-2 space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div
        key={post.slug}
        ref={contentRef}
        className="prose-content measure mt-10"
      >
        <Content components={mdxComponents} />
      </div>

      {newer || older ? (
        <nav
          aria-label="More writing"
          className="rule mt-16 grid gap-6 pt-5 sm:grid-cols-2"
        >
          {older ? (
            <Link to={`/blog/${older.slug}`} className="group flex flex-col gap-1">
              <span className="text-meta text-muted-foreground">Previous</span>
              <span className="row-link voice text-[1.0625rem] leading-snug text-balance">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              to={`/blog/${newer.slug}`}
              className="group flex flex-col gap-1 sm:text-right"
            >
              <span className="text-meta text-muted-foreground">Next</span>
              <span className="row-link voice text-[1.0625rem] leading-snug text-balance">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <div className="rule mt-10 flex flex-wrap items-baseline justify-between gap-y-2 pt-5 text-[0.9375rem]">
        <Link to="/blog" className="link">
          All writing
        </Link>
        <a href={`mailto:${personalInfo.basics.email}`} className="link">
          Reply by email
        </a>
      </div>
    </article>
  )
}
