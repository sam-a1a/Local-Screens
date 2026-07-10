import { useState } from 'react'

interface Props {
    url: string
    onSubmit: (url: string) => void
    cardWidth: number
    onCardWidthChange: (w: number) => void
}

export default function UrlBar({ url, onSubmit, cardWidth, onCardWidthChange }: Props) {
    const [value, setValue] = useState(url)

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit(value)
            }}
            className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-neutral-800 bg-neutral-900"
        >
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="http://localhost:3000"
                className="flex-1 min-w-[240px] rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500"
            />
            <button
                type="submit"
                className="rounded-lg bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-white transition"
            >
                Load
            </button>

            <div className="flex items-center gap-2 text-sm text-neutral-400">
                <label htmlFor="scale">Card width</label>
                <input
                    id="scale"
                    type="range"
                    min={220}
                    max={480}
                    value={cardWidth}
                    onChange={(e) => onCardWidthChange(Number(e.target.value))}
                />
                <span className="w-10 text-right">{cardWidth}px</span>
            </div>
        </form>
    )
}