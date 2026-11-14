import { PostRow } from "@/components/post-row"
import { getAllPosts } from "@/lib/blog"
import { usePageMetadata } from "@/lib/metadata"

export function BlogIndexPage() {
  const posts = getAllPosts()

  usePageMetadata({
    title: "Writing",
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

      <ul className="mt-12">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} showSummary />
        ))}
      </ul>
    </div>
  )
}
