// Renders every known route into static HTML after the client and SSR builds,
// so content is in the first byte (crawlers, link previews, no-JS readers).
//   /            -> dist/index.html
//   /about       -> dist/about.html     (served at /about by Workers assets)
//   /blog/<slug> -> dist/blog/<slug>.html
//   dist/shell.html keeps the empty shell; the worker serves it for 404s.
import { promises as fs } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const rootDir = path.resolve(import.meta.dirname, "..")
const distDir = path.join(rootDir, "dist")
const ROOT_TAG = '<div id="root"></div>'

const { render, routes } = await import(
  pathToFileURL(path.join(rootDir, "dist-ssr", "entry-server.js")).href
)

const shell = await fs.readFile(path.join(distDir, "index.html"), "utf8")
if (!shell.includes(ROOT_TAG)) throw new Error(`index.html has no ${ROOT_TAG}`)

await fs.writeFile(path.join(distDir, "shell.html"), shell)

export function outputPathFor(route) {
  return route === "/" ? "index.html" : `${route.slice(1)}.html`
}

for (const route of routes()) {
  const html = render(route)
  if (!html.includes("<main")) throw new Error(`Prerender of ${route} produced no <main>`)

  const page = shell.replace(
    ROOT_TAG,
    `<div id="root" data-prerendered="${route}">${html}</div>`
  )
  const outPath = path.join(distDir, outputPathFor(route))
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, page)
}

console.log(`Prerendered ${routes().length} routes`)
