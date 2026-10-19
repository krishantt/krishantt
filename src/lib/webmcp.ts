import { getAllPosts } from "@/lib/blog"
import { personalInfo } from "@/lib/personal-info"

type ToolResult = Record<string, unknown> | Record<string, unknown>[]

type ModelContextTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => ToolResult | Promise<ToolResult>
}

type ModelContext = {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal }
  ) => Promise<unknown> | void
}

const routes = ["/", "/about", "/blog"]

function getModelContext() {
  // The spec moved this from navigator to document; support both.
  const target = navigator as Navigator & { modelContext?: ModelContext }
  const doc = document as Document & { modelContext?: ModelContext }
  return target.modelContext ?? doc.modelContext
}

const tools: ModelContextTool[] = [
  {
    name: "search_blog_posts",
    description:
      "Search Krishant Timilsina's blog posts by keyword and return matching titles, summaries and URLs.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword to match against post titles, summaries and tags.",
        },
      },
      required: ["query"],
    },
    execute: ({ query }) => {
      const needle = String(query ?? "").toLowerCase()
      return getAllPosts()
        .filter((post) =>
          [post.title, post.summary, ...post.tags]
            .join(" ")
            .toLowerCase()
            .includes(needle)
        )
        .map((post) => ({
          title: post.title,
          summary: post.summary,
          date: post.date,
          url: `/blog/${post.slug}`,
        }))
    },
  },
  {
    name: "get_profile",
    description:
      "Get Krishant Timilsina's profile: headline, summary, location, skills, social links and contact email.",
    inputSchema: { type: "object", properties: {} },
    execute: () => ({
      name: personalInfo.basics.name,
      headline: personalInfo.basics.headline,
      summary: personalInfo.basics.summary,
      location: personalInfo.basics.location,
      email: personalInfo.basics.email,
      website: personalInfo.basics.website,
      resumeUrl: "/docs/resume.pdf",
      skills: personalInfo.skills,
      focusAreas: personalInfo.focusAreas,
      socials: personalInfo.socials,
    }),
  },
  {
    name: "navigate_to_page",
    description: "Navigate the site to a page: home, about or blog.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          enum: routes,
          description: "Page path to open.",
        },
      },
      required: ["path"],
    },
    execute: ({ path }) => {
      const target = routes.includes(String(path)) ? String(path) : "/"
      window.location.assign(target)
      return { navigatedTo: target }
    },
  },
]

export function registerWebMcpTools() {
  const modelContext = getModelContext()
  if (!modelContext?.registerTool) return

  const controller = new AbortController()
  const options = { signal: controller.signal }

  for (const tool of tools) {
    // Duplicate names reject; ignore so repeated registrations don't break the page.
    Promise.resolve(modelContext.registerTool(tool, options)).catch(() => {})
  }

  window.addEventListener("pagehide", () => controller.abort(), { once: true })
}
