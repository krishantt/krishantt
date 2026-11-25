import { Children, isValidElement, type ReactNode } from "react"

import { slugify } from "@/lib/post-tools"

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children)
  }
  return Children.toArray(node).map(textOf).join("")
}

type HeadingProps = { children?: ReactNode }

function anchored(Tag: "h2" | "h3") {
  return function Heading({ children }: HeadingProps) {
    const id = slugify(textOf(children))

    return (
      <Tag id={id} className="anchored">
        {children}
        <a href={`#${id}`} className="anchor" aria-label="Link to this section">
          #
        </a>
      </Tag>
    )
  }
}

/** Passed to every post's MDX `Content` so headings get stable, linkable ids. */
export const mdxComponents = {
  h2: anchored("h2"),
  h3: anchored("h3"),
}
