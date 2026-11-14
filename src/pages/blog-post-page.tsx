import { Link, Navigate, useParams } from "react-router-dom"

import { getPostBySlug } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { personalInfo } from "@/lib/personal-info"
import { formatDate } from "@/utils/format-date"

export function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined

  usePageMetadata(
    post
      ? {
          title: post.title,
          description: post.summary,
          markdownPath: `/blog/${post.slug}.md`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            datePublished: post.date,
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

  return (
    <article>
      <header>
        <h1 className="voice text-[1.875rem] leading-[1.15] tracking-[-0.02em] text-balance sm:text-[2.25rem]">
          {post.title}
        </h1>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-meta text-muted-foreground tabular-nums">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTimeMinutes} min read</span>
          <span>{post.tags.join(", ")}</span>
        </p>
      </header>

      <div className="prose-content measure mt-10">
        <post.Content />
      </div>

      <div className="rule mt-16 flex flex-wrap items-baseline justify-between gap-y-2 pt-5 text-[0.9375rem]">
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
