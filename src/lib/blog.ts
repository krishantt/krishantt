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

const postSources = import.meta.glob<string>("../content/posts/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
})

const AVERAGE_WORDS_PER_MINUTE = 200

function estimateReadingTime(source: string) {
  const words = source
    .replace(/export const meta\s*=\s*{[\s\S]*?\n}\n?/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.round(words / AVERAGE_WORDS_PER_MINUTE))
}

const allPosts = Object.entries(postModules)
  .map(([path, module]) => {
    const slug = path.split("/").pop()?.replace(".mdx", "") ?? ""

    return {
      ...module.meta,
      slug,
      Content: module.default,
      readingTimeMinutes: estimateReadingTime(postSources[path]),
    } satisfies BlogPost
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getAllPosts() {
  return allPosts
}

export function getPostBySlug(slug: string) {
  return allPosts.find((post) => post.slug === slug)
}
