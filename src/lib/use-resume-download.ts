import { useCallback, useState } from "react"

/**
 * The résumé PDF is generated in the browser (jsPDF), so the machinery is
 * loaded on demand.
 */
export function useResumeDownload() {
  const [isPreparing, setIsPreparing] = useState(false)

  const download = useCallback(async () => {
    if (isPreparing) return

    setIsPreparing(true)

    try {
      const { downloadResume } = await import("@/lib/resume")
      await downloadResume()
    } finally {
      setIsPreparing(false)
    }
  }, [isPreparing])

  return { download, isPreparing }
}
