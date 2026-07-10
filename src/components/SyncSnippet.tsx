import { useState } from 'react'

const SNIPPET = `;(function () {
  function getRatios() {
    var doc = document.documentElement
    var body = document.body
    var scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight
    var scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth
    return {
      ratioY: scrollHeight > 0 ? window.scrollY / scrollHeight : 0,
      ratioX: scrollWidth > 0 ? window.scrollX / scrollWidth : 0,
    }
  }

  function sendScroll() {
    if (window.parent === window) return
    var ratios = getRatios()
    window.parent.postMessage(
      { type: 'localscreens:scroll', ratioX: ratios.ratioX, ratioY: ratios.ratioY },
      '*'
    )
  }

  window.addEventListener('scroll', sendScroll, { passive: true })

  window.addEventListener('message', function (event) {
    var data = event.data
    if (!data || data.type !== 'localscreens:set-scroll') return
    var doc = document.documentElement
    var body = document.body
    var scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight) - window.innerHeight
    var scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth
    window.scrollTo(data.ratioX * scrollWidth, data.ratioY * scrollHeight)
  })
})();`

export default function SyncSnippet() {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(SNIPPET)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="border-b border-neutral-800 bg-neutral-900">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full text-left px-6 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition"
            >
                {open ? 'Hide' : 'Show'} sync snippet (paste into your app once to enable scroll sync)
            </button>
            {open && (
                <div className="px-6 pb-4">
          <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 overflow-x-auto">
            <code>{SNIPPET}</code>
          </pre>
                    <button
                        onClick={handleCopy}
                        className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
                    >
                        {copied ? 'Copied!' : 'Copy snippet'}
                    </button>
                    <p className="text-xs text-neutral-500 mt-2">
                        Add this as an inline script tag near the end of your app's index.html (or any page
                        you're testing). It only reports scroll position via postMessage — nothing else.
                    </p>
                </div>
            )}
        </div>
    )
}