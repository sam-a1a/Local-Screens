import { useEffect, useState } from 'react'
import type { Device } from '../data/devices'

const STORAGE_KEY = 'localscreens:custom-devices'

function load(): Device[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Device[]) : []
    } catch {
        return []
    }
}

export function useCustomDevices() {
    const [customDevices, setCustomDevices] = useState<Device[]>(() => load())

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customDevices))
    }, [customDevices])

    function addDevice(name: string, width: number, height: number, dpr: number) {
        const device: Device = {
            id: `custom-${Date.now()}`,
            name,
            width,
            height,
            dpr,
            category: 'custom',
        }
        setCustomDevices((prev) => [...prev, device])
    }

    function removeDevice(id: string) {
        setCustomDevices((prev) => prev.filter((d) => d.id !== id))
    }

    function exportDevices() {
        const blob = new Blob([JSON.stringify(customDevices, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'localscreens-custom-devices.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    function importDevices(file: File) {
        const reader = new FileReader()
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string) as Device[]
                const valid = parsed.filter(
                    (d) =>
                        typeof d.name === 'string' &&
                        typeof d.width === 'number' &&
                        typeof d.height === 'number' &&
                        typeof d.dpr === 'number'
                )
                const withFreshIds = valid.map((d) => ({
                    ...d,
                    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    category: 'custom' as const,
                }))
                setCustomDevices((prev) => [...prev, ...withFreshIds])
            } catch {
                alert('Could not parse that file — make sure it is a valid LocalScreens JSON export.')
            }
        }
        reader.readAsText(file)
    }

    return { customDevices, addDevice, removeDevice, exportDevices, importDevices }
}