import { Link, Navigate, useParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getPostBySlug } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"
import { formatDate } from "@/utils/format-date"

export function BlogPostPage() {
  const { slug } = useParams()

  if (!slug) {
    return <Navigate to="/blog" replace />
  }

  const post = getPostBySlug(slug)

  usePageMetadata(
    post
      ? {
          title: post.title,
          description: post.summary,
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

  if (!post) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Post not found</CardTitle>
          <CardDescription>
            We could not find that article. Check the URL or go back to the blog
            index.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/blog">Back to blog</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <article className="flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl leading-tight font-semibold">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(post.date)} • {post.readingTimeMinutes} min read
        </p>
      </header>
      <Card className="bg-card/90">
        <CardContent className="prose-content pt-4">
          <post.Content />
        </CardContent>
      </Card>
    </article>
  )
}
