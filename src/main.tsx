import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { registerWebMcpTools } from "@/lib/webmcp.ts"

registerWebMcpTools()

const container = document.getElementById("root")!
const app = (
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

// Hydrate only when the prerendered markup is for exactly this URL; a query
// string (e.g. ?tag=) or the bare shell means the client renders from scratch.
const prerenderedFor = container.dataset.prerendered
if (
  prerenderedFor !== undefined &&
  prerenderedFor === window.location.pathname &&
  window.location.search === ""
) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
