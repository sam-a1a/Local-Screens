import { useState, useEffect } from 'react'
import { devices, type Device } from './data/devices'
import DeviceFrame from './components/DeviceFrame'
import UrlBar from './components/UrlBar'
import CategoryFilter from './components/CategoryFilter'

const STORAGE_KEY = 'localscreens:last-url'

export type Category = Device['category']

export default function App() {
    const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'http://localhost:3000')
    const [cardWidth, setCardWidth] = useState(320)
    const [category, setCategory] = useState<Category>('laptop')

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, url)
    }, [url])

    const filteredDevices = devices.filter((d) => d.category === category)

    return (
        <div className="min-h-screen">
            <header className="px-6 py-4 border-b border-neutral-800">
                <h1 className="text-lg font-semibold">LocalScreens</h1>
                <p className="text-sm text-neutral-500">
                    Preview your local dev server across real device viewports.
                </p>
            </header>

            <UrlBar url={url} onSubmit={setUrl} cardWidth={cardWidth} onCardWidthChange={setCardWidth} />

            <CategoryFilter selected={category} onSelect={setCategory} />

            <main className="p-6 flex flex-col items-center gap-6">
                {filteredDevices.map((device) => (
                    <DeviceFrame key={device.id} device={device} url={url} cardWidth={cardWidth} />
                ))}
            </main>
        </div>
    )
}