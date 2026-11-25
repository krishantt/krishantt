// Per-route <head> metadata, injected into the SPA shell by the worker so that
// crawlers and link-preview bots (which do not run JS) see the right page.

export const SITE = "https://krishant.com.np"
const NAME = "Krishant Timilsina"
const DEFAULT_DESCRIPTION =
  "Software engineer in Pokhara, Nepal, working on platform and product engineering: cloud infrastructure, APIs, and the interfaces on top."
const DEFAULT_IMAGE = `${SITE}/og/default.png`

export function normalizePath(pathname) {
  if (pathname === "/index.html") return "/"
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
}

/** Returns head metadata for a route, or null when the route does not exist. */
export function pageMetaFor(pathname, posts) {
  const path = normalizePath(pathname)

  if (path === "/") {
    return { title: NAME, description: DEFAULT_DESCRIPTION, url: `${SITE}/`, image: DEFAULT_IMAGE, type: "website" }
  }

  if (path === "/about") {
    return {
      title: `About | ${NAME}`,
      description: `About ${NAME}: experience, projects, and how to get in touch.`,
      url: `${SITE}/about`,
      image: DEFAULT_IMAGE,
      type: "profile",
    }
  }

  if (path === "/blog") {
    return {
      title: `Writing | ${NAME}`,
      description: `Essays and notes on software systems by ${NAME}.`,
      url: `${SITE}/blog`,
      image: DEFAULT_IMAGE,
      type: "website",
    }
  }

  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1]
  const post = slug && posts.find((p) => p.slug === slug)
  if (!post) return null

  const url = `${SITE}/blog/${post.slug}`
  const image = `${SITE}/og/${post.slug}.png`

  return {
    title: `${post.title} | ${NAME}`,
    description: post.summary,
    url,
    image,
    type: "article",
    publishedTime: post.date,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      image,
      keywords: post.tags.join(", "),
      url,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: NAME, url: `${SITE}/` },
    },
  }
}

export const NOT_FOUND_META = {
  title: `Page not found | ${NAME}`,
  description: DEFAULT_DESCRIPTION,
  url: null,
  image: DEFAULT_IMAGE,
  type: "website",
  noindex: true,
}

/** Paths the SPA fallback should never claim to serve as a page. */
export function looksLikeFile(pathname) {
  return /\.[a-z0-9]{1,8}$/i.test(pathname)
}
