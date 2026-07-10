import { useSync } from '../context/SyncContext'

export default function BreakpointBar() {
    const { breakpoints } = useSync()

    if (breakpoints.length === 0) return null

    return (
        <div className="px-6 py-2 border-b border-neutral-800 bg-neutral-900 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-neutral-500">Detected breakpoints:</span>
            {breakpoints.map((bp) => (
                <span
                    key={bp}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 font-mono"
                >
          {bp}px
        </span>
            ))}
        </div>
    )
}