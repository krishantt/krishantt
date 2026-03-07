declare module "*.mdx" {
  import type { ComponentType } from "react"

  export const meta: {
    title: string
    date: string
    summary: string
    tags: string[]
  }

  const Component: ComponentType
  export default Component
}
