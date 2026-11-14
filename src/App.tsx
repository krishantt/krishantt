import { BrowserRouter, Route, Routes } from "react-router-dom"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import {
  AboutPage,
  BlogIndexPage,
  BlogPostPage,
  HomePage,
  NotFoundPage,
} from "@/pages"

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus:rounded-sm focus:bg-card focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="shell mt-14 flex-1 sm:mt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

export default App
