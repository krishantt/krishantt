import type { ComponentType } from "react"

export type BlogMeta = {
  title: string
  date: string
  summary: string
  tags: string[]
}

export type BlogPost = BlogMeta & {
  slug: string
  readingTimeMinutes: number
  Content: ComponentType
}

type PostModule = {
  default: ComponentType
  meta: BlogMeta
}

const postModules = import.meta.glob<PostModule>("../content/posts/*.mdx", {
  eager: true,
})

function estimateReadingTime(title: string, summary: string) {
  const words = `${title} ${summary}`.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 40))
}

const allPosts = Object.entries(postModules)
  .map(([path, module]) => {
    const slug = path.split("/").pop()?.replace(".mdx", "") ?? ""

    return {
      ...module.meta,
      slug,
      Content: module.default,
      readingTimeMinutes: estimateReadingTime(
        module.meta.title,
        module.meta.summary
      ),
    } satisfies BlogPost
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getAllPosts() {
  return allPosts
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug)
}
