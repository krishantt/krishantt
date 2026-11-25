/**
 * Pure helpers for post navigation, heading anchors and tag filtering.
 * Kept free of React and `import.meta.glob` so `bun test` can load them directly.
 */

type PostLike = { slug: string; tags: string[] }

/** "1. Context is written down once" -> "1-context-is-written-down-once" */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[`'"’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Posts are sorted newest first. `newer` is the one before, `older` the one
 * after; either is undefined at the ends of the list.
 */
export function getAdjacentPosts<T extends PostLike>(posts: T[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) return { newer: undefined, older: undefined }

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index < posts.length - 1 ? posts[index + 1] : undefined,
  }
}

/** Case-insensitive, so `/blog?tag=go` and `/blog?tag=Go` both work. */
export function filterPostsByTag<T extends PostLike>(
  posts: T[],
  tag: string | null | undefined
) {
  if (!tag) return posts
  const wanted = tag.toLowerCase()
  return posts.filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === wanted)
  )
}

/** The tag as the posts spell it, so the filter label matches the post meta. */
export function canonicalTag(posts: PostLike[], tag: string) {
  const wanted = tag.toLowerCase()
  for (const post of posts) {
    const match = post.tags.find((postTag) => postTag.toLowerCase() === wanted)
    if (match) return match
  }
  return tag
}

/** Every tag with its post count, most used first, then alphabetical. */
export function getTagCounts(posts: PostLike[]) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function tagHref(tag: string) {
  return `/blog?tag=${encodeURIComponent(tag)}`
}
