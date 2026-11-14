import { Link } from "react-router-dom"

import type { BlogPost } from "@/lib/blog"
import { formatDate } from "@/utils/format-date"

type PostRowProps = {
  post: BlogPost
  showSummary?: boolean
}

export function PostRow({ post, showSummary = false }: PostRowProps) {
  return (
    <li className="rule">
      <Link
        to={`/blog/${post.slug}`}
        className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
      >
        <span className="flex flex-col gap-1.5">
          <span className="row-link text-[0.9375rem] font-medium text-balance">
            {post.title}
          </span>
          {showSummary ? (
            <span className="measure text-sm text-muted-foreground">
              {post.summary}
            </span>
          ) : null}
        </span>
        <span className="flex shrink-0 gap-4 text-meta text-muted-foreground tabular-nums">
          <span>{formatDate(post.date)}</span>
          <span className="w-11 text-right">{post.readingTimeMinutes} min</span>
        </span>
      </Link>
    </li>
  )
}
