import { useEffect } from "react"

const SITE_NAME = "Krishant Timilsina"
const DEFAULT_DESCRIPTION =
  "Software engineer crafting full-stack products, thoughtful interfaces, and practical DevOps systems."

type PageMetadata = {
  title?: string
  description?: string
}

function upsertMetaTag(attribute: "name" | "property", key: string) {
  const selector = `meta[${attribute}='${key}']`
  let meta = document.querySelector(selector)

  if (meta instanceof HTMLMetaElement) {
    return meta
  }

  meta = document.createElement("meta")
  meta.setAttribute(attribute, key)
  document.head.appendChild(meta)
  return meta as HTMLMetaElement
}

export function usePageMetadata({ title, description }: PageMetadata) {
  useEffect(() => {
    const resolvedDescription = description ?? DEFAULT_DESCRIPTION
    const resolvedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    document.title = resolvedTitle

    upsertMetaTag("name", "description").setAttribute(
      "content",
      resolvedDescription
    )
    upsertMetaTag("property", "og:title").setAttribute("content", resolvedTitle)
    upsertMetaTag("property", "og:description").setAttribute(
      "content",
      resolvedDescription
    )
    upsertMetaTag("property", "twitter:title").setAttribute(
      "content",
      resolvedTitle
    )
    upsertMetaTag("property", "twitter:description").setAttribute(
      "content",
      resolvedDescription
    )
  }, [title, description])
}
