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

  function scanBreakpoints() {
    var found = {}
    var sheets = document.styleSheets
    for (var i = 0; i < sheets.length; i++) {
      var rules
      try {
        rules = sheets[i].cssRules
      } catch (e) {
        continue
      }
      if (!rules) continue
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j]
        if (rule.type === CSSRule.MEDIA_RULE) {
          var text = rule.conditionText || rule.media.mediaText
          var matches = text.match(/(min|max)-width:\\s*(\\d+(?:\\.\\d+)?)(px|em|rem)/g)
          if (!matches) continue
          for (var k = 0; k < matches.length; k++) {
            var m = matches[k].match(/(\\d+(?:\\.\\d+)?)(px|em|rem)/)
            if (!m) continue
            var value = parseFloat(m[1])
            var unit = m[2]
            var px = unit === 'px' ? value : value * 16
            found[Math.round(px)] = true
          }
        }
      }
    }
    var list = Object.keys(found).map(Number).sort(function (a, b) { return a - b })
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'localscreens:breakpoints', breakpoints: list }, '*')
    }
  }

  if (document.readyState === 'complete') {
    scanBreakpoints()
  } else {
    window.addEventListener('load', scanBreakpoints)
  }
  setTimeout(scanBreakpoints, 800)

  function checkOverflow() {
    var doc = document.documentElement
    var actualWidth = doc.scrollWidth
    var viewportWidth = window.innerWidth
    var overflowAmount = actualWidth - viewportWidth
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'localscreens:overflow',
          overflowing: overflowAmount > 2,
          amount: Math.max(0, Math.round(overflowAmount)),
        },
        '*'
      )
    }
  }

  var overflowTimer = null
  function scheduleOverflowCheck() {
    clearTimeout(overflowTimer)
    overflowTimer = setTimeout(checkOverflow, 150)
  }

  window.addEventListener('resize', scheduleOverflowCheck)
  window.addEventListener('load', scheduleOverflowCheck)
  setTimeout(checkOverflow, 500)
  setTimeout(checkOverflow, 1500)

  if (window.MutationObserver) {
    var observer = new MutationObserver(scheduleOverflowCheck)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })
  }

  var inspectEnabled = false
  var highlightEl = null

  function clearHighlight() {
    if (highlightEl) {
      highlightEl.style.outline = ''
      highlightEl.style.outlineOffset = ''
      highlightEl = null
    }
  }

  function buildSelector(el) {
    if (!(el instanceof Element)) return null
    var parts = []
    var node = el
    while (node && node.nodeType === 1 && parts.length < 6) {
      var part = node.tagName.toLowerCase()
      if (node.id) {
        part += '#' + node.id
        parts.unshift(part)
        break
      } else {
        var siblingIndex = 1
        var sib = node
        while ((sib = sib.previousElementSibling)) {
          if (sib.tagName === node.tagName) siblingIndex++
        }
        part += ':nth-of-type(' + siblingIndex + ')'
      }
      parts.unshift(part)
      node = node.parentElement
    }
    return parts.join(' > ')
  }

  document.addEventListener(
    'click',
    function (e) {
      if (!inspectEnabled) return
      e.preventDefault()
      e.stopPropagation()
      var selector = buildSelector(e.target)
      if (selector && window.parent !== window) {
        window.parent.postMessage({ type: 'localscreens:element-selected', selector: selector }, '*')
      }
    },
    true
  )

  window.addEventListener('message', function (event) {
    var data = event.data
    if (!data) return

    if (data.type === 'localscreens:set-scroll') {
      var doc2 = document.documentElement
      var body2 = document.body
      var scrollHeight2 = Math.max(doc2.scrollHeight, body2.scrollHeight) - window.innerHeight
      var scrollWidth2 = Math.max(doc2.scrollWidth, body2.scrollWidth) - window.innerWidth
      window.scrollTo(data.ratioX * scrollWidth2, data.ratioY * scrollHeight2)
      return
    }

    if (data.type === 'localscreens:inspect-toggle') {
      inspectEnabled = !!data.enabled
      document.body.style.cursor = inspectEnabled ? 'crosshair' : ''
      if (!inspectEnabled) clearHighlight()
      return
    }

    if (data.type === 'localscreens:highlight') {
      clearHighlight()
      if (!data.selector) return
      try {
        var found = document.querySelector(data.selector)
        if (found) {
          found.style.outline = '3px solid #f59e0b'
          found.style.outlineOffset = '2px'
          highlightEl = found
        }
      } catch (err) {}
    }
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
                {open ? 'Hide' : 'Show'} sync snippet (scroll sync + breakpoints + overflow + inspector)
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
                        Paste this as an inline script near the end of your app's index.html. Enables scroll
                        sync, breakpoint detection, overflow detection, and cross-device element inspection —
                        nothing leaves the page except back to this tab via postMessage.
                    </p>
                </div>
            )}
        </div>
    )
}