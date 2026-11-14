import { useResumeDownload } from "@/lib/use-resume-download"

/** Reads as a link, behaves as a button: it triggers a download, not a route. */
export function ResumeDownload() {
  const { download, isPreparing } = useResumeDownload()

  return (
    <button
      type="button"
      onClick={() => void download()}
      disabled={isPreparing}
      className="link disabled:opacity-60"
    >
      {isPreparing ? "Preparing PDF" : "Download résumé"}
    </button>
  )
}
