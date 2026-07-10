import { useState } from 'react'

interface Props {
    onAdd: (name: string, width: number, height: number, dpr: number) => void
}

export default function AddCustomDeviceForm({ onAdd }: Props) {
    const [name, setName] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [dpr, setDpr] = useState('1')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const w = Number(width)
        const h = Number(height)
        const d = Number(dpr)
        if (!name || !w || !h || !d) return
        onAdd(name, w, h, d)
        setName('')
        setWidth('')
        setHeight('')
        setDpr('1')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-center gap-2 px-6 py-4 border-b border-neutral-800 bg-neutral-900"
        >
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Device name"
                className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500 w-40"
            />
            <input
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                type="number"
                className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500 w-24"
            />
            <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                type="number"
                className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500 w-24"
            />
            <input
                value={dpr}
                onChange={(e) => setDpr(e.target.value)}
                placeholder="DPR"
                type="number"
                step="0.1"
                className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-500 w-20"
            />
            <button
                type="submit"
                className="rounded-lg bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-white transition"
            >
                Add device
            </button>
        </form>
    )
}