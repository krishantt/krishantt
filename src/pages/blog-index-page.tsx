import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllPosts } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { formatDate } from "@/utils/format-date"

export function BlogIndexPage() {
  const posts = getAllPosts()

  usePageMetadata({
    title: "Blog",
    description:
      "Articles on software engineering, systems design, and practical development lessons by Krishant Timilsina.",
  })

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle>
                <Link to={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.summary}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(post.date)}</span>
              <span>{post.readingTimeMinutes} min read</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
