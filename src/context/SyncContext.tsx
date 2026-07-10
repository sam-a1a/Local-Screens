import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react'

interface SyncContextValue {
    syncEnabled: boolean
    setSyncEnabled: (v: boolean) => void
    registerFrame: (id: string, win: Window | null) => void
    unregisterFrame: (id: string) => void
}

const SyncContext = createContext<SyncContextValue | null>(null)

export function SyncProvider({ children }: { children: ReactNode }) {
    const [syncEnabled, setSyncEnabled] = useState(false)
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

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (!syncEnabledRef.current) return
            const data = event.data
            if (!data || data.type !== 'localscreens:scroll') return

            framesRef.current.forEach((win) => {
                if (win === event.source) return
                win.postMessage(
                    { type: 'localscreens:set-scroll', ratioX: data.ratioX, ratioY: data.ratioY },
                    '*'
                )
            })
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <SyncContext.Provider value={{ syncEnabled, setSyncEnabled, registerFrame, unregisterFrame }}>
            {children}
        </SyncContext.Provider>
    )
}

export function useSync() {
    const ctx = useContext(SyncContext)
    if (!ctx) throw new Error('useSync must be used within SyncProvider')
    return ctx
}