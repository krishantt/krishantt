import { useEffect } from "react"

const SITE_NAME = "Krishant Timilsina"
const DEFAULT_DESCRIPTION =
  "Software engineer crafting full-stack products, thoughtful interfaces, and practical DevOps systems."

type PageMetadata = {
  title?: string
  description?: string
  jsonLd?: object
  markdownPath?: string
}

const JSON_LD_ELEMENT_ID = "page-jsonld"
const MARKDOWN_LINK_ID = "page-markdown"

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

export function usePageMetadata({
  title,
  description,
  jsonLd,
  markdownPath,
}: PageMetadata) {
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

    const existingScript = document.getElementById(JSON_LD_ELEMENT_ID)
    existingScript?.remove()

    document.getElementById(MARKDOWN_LINK_ID)?.remove()

    if (markdownPath) {
      const link = document.createElement("link")
      link.id = MARKDOWN_LINK_ID
      link.rel = "alternate"
      link.type = "text/markdown"
      link.href = markdownPath
      document.head.appendChild(link)
    }

    if (jsonLd) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.id = JSON_LD_ELEMENT_ID
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById(JSON_LD_ELEMENT_ID)?.remove()
      document.getElementById(MARKDOWN_LINK_ID)?.remove()
    }
  }, [title, description, jsonLd, markdownPath])
}
