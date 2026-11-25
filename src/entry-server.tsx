import { StrictMode } from "react"
import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router"

import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { getAllPosts } from "@/lib/blog"

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ThemeProvider>
    </StrictMode>
  )
}

export function routes() {
  return ["/", "/about", "/blog", ...getAllPosts().map((p) => `/blog/${p.slug}`)]
}
