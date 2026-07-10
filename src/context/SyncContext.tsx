import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react'

interface SyncContextValue {
    syncEnabled: boolean
    setSyncEnabled: (v: boolean) => void
    inspectEnabled: boolean
    setInspectEnabled: (v: boolean) => void
    registerFrame: (id: string, win: Window | null) => void
    unregisterFrame: (id: string) => void
    breakpoints: number[]
}

const SyncContext = createContext<SyncContextValue | null>(null)

export function SyncProvider({ children }: { children: ReactNode }) {
    const [syncEnabled, setSyncEnabledState] = useState(false)
    const [inspectEnabled, setInspectEnabledState] = useState(false)
    const [breakpoints, setBreakpoints] = useState<number[]>([])
    const framesRef = useRef<Map<string, Window>>(new Map())
    const syncEnabledRef = useRef(syncEnabled)

    useEffect(() => {
        syncEnabledRef.current = syncEnabled
    }, [syncEnabled])

    const registerFrame = useCallback((id: string, win: Window | null) => {
        if (win) framesRef.current.set(id, win)
    }, [])

    const unregisterFrame = useCallback((id: string) => {
        framesRef.current.delete(id)
    }, [])

    const setSyncEnabled = useCallback((v: boolean) => {
        setSyncEnabledState(v)
    }, [])

    const setInspectEnabled = useCallback((v: boolean) => {
        setInspectEnabledState(v)
        framesRef.current.forEach((win) => {
            win.postMessage({ type: 'localscreens:inspect-toggle', enabled: v }, '*')
        })
    }, [])

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            const data = event.data
            if (!data) return

            if (data.type === 'localscreens:scroll' && syncEnabledRef.current) {
                framesRef.current.forEach((win) => {
                    if (win === event.source) return
                    win.postMessage(
                        { type: 'localscreens:set-scroll', ratioX: data.ratioX, ratioY: data.ratioY },
                        '*'
                    )
                })
                return
            }

            if (data.type === 'localscreens:breakpoints' && Array.isArray(data.breakpoints)) {
                setBreakpoints((prev) => {
                    const merged = new Set([...prev, ...data.breakpoints])
                    return Array.from(merged).sort((a, b) => a - b)
                })
                return
            }

            if (data.type === 'localscreens:element-selected' && typeof data.selector === 'string') {
                framesRef.current.forEach((win) => {
                    win.postMessage({ type: 'localscreens:highlight', selector: data.selector }, '*')
                })
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <SyncContext.Provider
            value={{
                syncEnabled,
                setSyncEnabled,
                inspectEnabled,
                setInspectEnabled,
                registerFrame,
                unregisterFrame,
                breakpoints,
            }}
        >
            {children}
        </SyncContext.Provider>
    )
}

export function useSync() {
    const ctx = useContext(SyncContext)
    if (!ctx) throw new Error('useSync must be used within SyncProvider')
    return ctx
}