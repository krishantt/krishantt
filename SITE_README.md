# Personal Site (Hugo Replacement)

A `pnpm` + Vite + React site that replaces the old Hugo site in `hugo.old`.
It uses shadcn/ui components and MDX-based blog posts.

## Stack

- React + TypeScript + Vite
- shadcn/ui (`radix-mira` style)
- Tailwind CSS v4
- MDX for blog content

## Run locally

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Add a new blog post

1. Create a file under `src/content/posts/<slug>.mdx`
2. Add `meta` export at the top:

```mdx
export const meta = {
  title: "Your title",
  date: "2026-03-07",
  summary: "One-line post summary",
  tags: ["Tag1", "Tag2"],
}

Your post content goes here.
```

The post will automatically appear in `/blog` and be available at `/blog/<slug>`.
