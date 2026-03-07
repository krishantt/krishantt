import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePageMetadata } from "@/lib/metadata"

export function NotFoundPage() {
  usePageMetadata({
    title: "Page not found",
    description:
      "The page you are looking for does not exist. Return home to continue browsing.",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page not found</CardTitle>
        <CardDescription>
          The page does not exist anymore. Try the home page.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline">
          <Link to="/">Go home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
