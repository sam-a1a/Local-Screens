import { useState, useEffect } from 'react'
import { devices } from './data/devices'
import DeviceFrame from './components/DeviceFrame'
import UrlBar from './components/UrlBar'

const STORAGE_KEY = 'localscreens:last-url'

export default function App() {
    const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'http://localhost:3000')
    const [cardWidth, setCardWidth] = useState(320)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, url)
    }, [url])

    return (
        <div className="min-h-screen">
            <header className="px-6 py-4 border-b border-neutral-800">
                <h1 className="text-lg font-semibold">LocalScreens</h1>
                <p className="text-sm text-neutral-500">
                    Preview your local dev server across real device viewports.
                </p>
            </header>

            <UrlBar url={url} onSubmit={setUrl} cardWidth={cardWidth} onCardWidthChange={setCardWidth} />

            <main className="p-6 flex flex-col items-center gap-6">
                {devices.map((device) => (
                    <DeviceFrame key={device.id} device={device} url={url} cardWidth={cardWidth} />
                ))}
            </main>
        </div>
    )
}