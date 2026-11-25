import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * BrowserRouter keeps the old scroll position on client-side navigation, so a
 * "Next post" link would land at the bottom of the next post. Reset to the top,
 * or to the heading when the URL carries a #hash.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
