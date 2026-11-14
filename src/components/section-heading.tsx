import type { ReactNode } from "react"

type SectionHeadingProps = {
  title: string
  action?: ReactNode
}

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="rule flex items-baseline justify-between gap-6 pt-4">
      <h2 className="voice text-[1.375rem] leading-tight tracking-tight">
        {title}
      </h2>
      {action}
    </div>
  )
}
