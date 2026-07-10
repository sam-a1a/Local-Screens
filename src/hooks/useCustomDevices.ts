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

    return { customDevices, addDevice, removeDevice }
}