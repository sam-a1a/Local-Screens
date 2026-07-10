import { useRef, useState } from 'react'

interface Props {
    onAdd: (name: string, width: number, height: number, dpr: number) => void
    onExport: () => void
    onImport: (file: File) => void
}

export default function AddCustomDeviceForm({ onAdd, onExport, onImport }: Props) {
    const [name, setName] = useState('')
    const [width, setWidth] = useState('')
    const [height, setHeight] = useState('')
    const [dpr, setDpr] = useState('1')
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) onImport(file)
        e.target.value = ''
    }

    return (
        <div className="border-b border-neutral-800 bg-neutral-900">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 px-6 py-4">
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

            <div className="flex items-center gap-2 px-6 pb-4">
                <button
                    onClick={onExport}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
                >
                    Export JSON
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
                >
                    Import JSON
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    )
}