import { useState, useEffect } from 'react'
import { devices, type Category } from './data/devices'
import { useCustomDevices } from './hooks/useCustomDevices'
import { SyncProvider, useSync } from './context/SyncContext'
import DeviceFrame from './components/DeviceFrame'
import UrlBar from './components/UrlBar'
import CategoryFilter from './components/CategoryFilter'
import AddCustomDeviceForm from './components/AddCustomDeviceForm'
import SyncSnippet from './components/SyncSnippet'
import BreakpointBar from './components/BreakpointBar'

const STORAGE_KEY = 'localscreens:last-url'

function AppInner() {
    const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'http://localhost:3000')
    const [cardWidth, setCardWidth] = useState(320)
    const [category, setCategory] = useState<Category>('laptop')
    const [reloadKey, setReloadKey] = useState(0)
    const { customDevices, addDevice, removeDevice, exportDevices, importDevices } = useCustomDevices()
    const { syncEnabled, setSyncEnabled } = useSync()

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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSyncEnabled(!syncEnabled)}
                        className={`text-sm px-3 py-1.5 rounded-lg transition ${
                            syncEnabled
                                ? 'bg-emerald-500 text-neutral-950 font-medium'
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                    >
                        {syncEnabled ? 'Sync scrolling: On' : 'Sync scrolling: Off'}
                    </button>
                    <button
                        onClick={() => setReloadKey((k) => k + 1)}
                        className="text-sm px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition"
                    >
                        Reload All
                    </button>
                </div>
            </header>

            <UrlBar url={url} onSubmit={setUrl} cardWidth={cardWidth} onCardWidthChange={setCardWidth} />

            <SyncSnippet />
            <BreakpointBar />

            <CategoryFilter selected={category} onSelect={setCategory} />

            {isCustom && (
                <AddCustomDeviceForm onAdd={addDevice} onExport={exportDevices} onImport={importDevices} />
            )}

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

export default function App() {
    return (
        <SyncProvider>
            <AppInner />
        </SyncProvider>
    )
}