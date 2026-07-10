import { useState, useEffect } from 'react'
import { devices, type Category } from './data/devices'
import { useCustomDevices } from './hooks/useCustomDevices'
import DeviceFrame from './components/DeviceFrame'
import UrlBar from './components/UrlBar'
import CategoryFilter from './components/CategoryFilter'
import AddCustomDeviceForm from './components/AddCustomDeviceForm'

const STORAGE_KEY = 'localscreens:last-url'

export default function App() {
    const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'http://localhost:3000')
    const [cardWidth, setCardWidth] = useState(320)
    const [category, setCategory] = useState<Category>('laptop')
    const [reloadKey, setReloadKey] = useState(0)
    const { customDevices, addDevice, removeDevice } = useCustomDevices()

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, url)
    }, [url])

    const isCustom = category === 'custom'
    const filteredDevices = isCustom
        ? customDevices
        : devices.filter((d) => d.category === category)

    return (
        <div className="min-h-screen">
            <header className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">LocalScreens</h1>
                    <p className="text-sm text-neutral-500">
                        Preview your local dev server across real device viewports.
                    </p>
                </div>
                <button
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
                >
                    Reload All
                </button>
            </header>

            <UrlBar url={url} onSubmit={setUrl} cardWidth={cardWidth} onCardWidthChange={setCardWidth} />

            <CategoryFilter selected={category} onSelect={setCategory} />

            {isCustom && <AddCustomDeviceForm onAdd={addDevice} />}

            <main className="p-6 flex flex-col items-center gap-6">
                {filteredDevices.length === 0 && isCustom && (
                    <p className="text-sm text-neutral-500">No custom devices yet — add one above.</p>
                )}
                {filteredDevices.map((device) => (
                    <DeviceFrame
                        key={`${device.id}-${reloadKey}`}
                        device={device}
                        url={url}
                        cardWidth={cardWidth}
                        onRemove={isCustom ? removeDevice : undefined}
                    />
                ))}
            </main>
        </div>
    )
}