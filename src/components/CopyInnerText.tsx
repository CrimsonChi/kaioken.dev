import { useState, useRef, useEffect } from "kaioken"
import { CopyIcon } from "./icons/CopyIcon"

export function CopyInnerText({ children }: { children: JSX.Children }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const copiedTimeout = useRef(-1)

  useEffect(
    () => () =>
      copiedTimeout.current !== -1 &&
      window.clearTimeout(copiedTimeout.current),
    []
  )

  async function copyToClipboard() {
    if (copiedTimeout.current !== -1) {
      window.clearTimeout(copiedTimeout.current!)
    }
    await navigator.clipboard.writeText(ref.current!.textContent!)
    setCopied(true)
    copiedTimeout.current = window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={ref} className="relative">
      {children}
      <div className="absolute top-0 right-0">
        <div className="flex justify-end">
          <button
            ariaLabel="Copy to clipboard"
            className="text-[#aaa] opacity-30 hover:opacity-60 focus:opacity-60 p-2"
            onclick={copyToClipboard}
          >
            <CopyIcon />
          </button>
        </div>
        {copied && (
          <span className="text-light text-xs p-1 bg-black mr-1">
            Copied to clipboard!
          </span>
        )}
      </div>
    </div>
  )
}
