import { usePageContext } from "$/context/pageContext"
import { useEffect, useRef } from "kaioken"
import Prism from "prismjs"
import "prismjs/components/prism-json"
import "prismjs/themes/prism-tomorrow.min.css"

export function JSONCodeBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  const { isClient } = usePageContext()
  const eleRef = useRef<HTMLElement>(null)
  const html = Prism.highlight(code, Prism.languages.json, "json")

  useEffect(() => {
    if (!eleRef.current) return
    if (isClient) {
      eleRef.current.innerHTML = html
    }
  }, [])

  return (
    <pre
      className={`p-4 bg-[#1a1a1a] dark:bg-[#0a0a0a] text-light overflow-x-auto text-xs sm:text-sm ${className || ""}`}
    >
      <code ref={eleRef}>{isClient ? "" : html}</code>
    </pre>
  )
}
