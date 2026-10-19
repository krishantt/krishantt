---
name: blog-search
description: Find and read Krishant Timilsina's blog posts on krishant.com.np.
---

# Blog search

Use this skill when a user asks what Krishant has written about, or wants the content of a post.

## Steps

1. Fetch `https://krishant.com.np/blog.md` for the post index (titles, dates, summaries).
2. Pick the post whose title or summary matches the request.
3. Fetch `https://krishant.com.np/blog/<slug>.md` for the full post as Markdown.
4. Fall back to `https://krishant.com.np/llms-full.txt` when the user wants all posts at once.
