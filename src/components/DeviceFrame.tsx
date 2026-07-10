import { useEffect, useRef, useState } from 'react'
import type { Device } from '../data/devices'
import { useSync } from '../context/SyncContext'

interface Props {
    device: Device
    url: string
    cardWidth: number
    onRemove?: (id: string) => void
}

const NEAR_THRESHOLD = 24

export default function DeviceFrame({ device, url, cardWidth, onRemove }: Props) {
    const [rotated, setRotated] = useState(false)
    const [scale, setScale] = useState(0.25)
    const [isVisible, setIsVisible] = useState(false)
    const [overflow, setOverflow] = useState<{ overflowing: boolean; amount: number } | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const { registerFrame, unregisterFrame, breakpoints } = useSync()

    const effectiveWidth = rotated ? device.height : device.width
    const effectiveHeight = rotated ? device.width : device.height

    useEffect(() => {
        setScale(cardWidth / effectiveWidth)
    }, [cardWidth, effectiveWidth])

    useEffect(() => {
        const node = wrapperRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '200px' }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        return () => unregisterFrame(device.id)
    }, [device.id, unregisterFrame])

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.source !== iframeRef.current?.contentWindow) return
            const data = event.data
            if (data?.type === 'localscreens:overflow') {
                setOverflow({ overflowing: data.overflowing, amount: data.amount })
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    function handleIframeLoad() {
        registerFrame(device.id, iframeRef.current?.contentWindow ?? null)
        setOverflow(null)
    }

    const scaledHeight = effectiveHeight * scale
    const canRotate = device.category === 'tablet' || device.category === 'phone'

    let nearestBreakpoint: number | null = null
    let distance = Infinity
    for (const bp of breakpoints) {
        const d = Math.abs(bp - effectiveWidth)
        if (d < distance) {
            distance = d
            nearestBreakpoint = bp
        }
    }
    const isNearBreakpoint = nearestBreakpoint !== null && distance <= NEAR_THRESHOLD
    const hasOverflow = overflow?.overflowing === true

    return (
        <div
            ref={wrapperRef}
            className={`rounded-xl border overflow-hidden shadow-lg bg-neutral-900 ${
                hasOverflow ? 'border-red-600' : 'border-neutral-800'
            }`}
        >
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
                <span className="text-sm font-medium text-neutral-200">{device.name}</span>
                <div className="flex items-center gap-3">
                    {hasOverflow && (
                        <span
                            className="text-xs px-2 py-0.5 rounded bg-red-900/60 text-red-400"
                            title="Page content is wider than the viewport"
                        >
              horizontal overflow (+{overflow!.amount}px)
            </span>
                    )}
                    {isNearBreakpoint && (
                        <span
                            className="text-xs px-2 py-0.5 rounded bg-amber-900/50 text-amber-400"
                            title={`Within ${distance}px of the ${nearestBreakpoint}px breakpoint`}
                        >
              near {nearestBreakpoint}px breakpoint
            </span>
                    )}
                    <span className="text-xs text-neutral-500">
            {effectiveWidth}x{effectiveHeight} - {device.dpr}x
          </span>
                    {canRotate && (
                        <button
                            onClick={() => setRotated((r) => !r)}
                            className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                            title="Rotate device"
                        >
                            Rotate
                        </button>
                    )}
                    {onRemove && (
                        <button
                            onClick={() => onRemove(device.id)}
                            className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-red-900 text-neutral-300 transition"
                            title="Remove device"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            <div
                className="relative bg-neutral-950"
                style={{ width: cardWidth, height: scaledHeight }}
            >
                {!url && (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                        Enter a URL above
                    </div>
                )}

                {url && !isVisible && (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                        Scroll into view to load
                    </div>
                )}

                {url && isVisible && (
                    <div
                        style={{
                            width: effectiveWidth,
                            height: effectiveHeight,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <iframe
                            ref={iframeRef}
                            src={url}
                            width={effectiveWidth}
                            height={effectiveHeight}
                            className="border-0"
                            title={device.name}
                            onLoad={handleIframeLoad}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}