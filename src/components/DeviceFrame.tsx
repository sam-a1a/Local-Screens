import { useEffect, useRef, useState } from 'react'
import type { Device } from '../data/devices'

interface Props {
    device: Device
    url: string
    cardWidth: number
}

export default function DeviceFrame({ device, url, cardWidth }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(0.25)

    useEffect(() => {
        setScale(cardWidth / device.width)
    }, [cardWidth, device.width])

    const scaledHeight = device.height * scale

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
                <span className="text-sm font-medium text-neutral-200">{device.name}</span>
                <span className="text-xs text-neutral-500">
          {device.width}×{device.height} · {device.dpr}x
        </span>
            </div>

            <div
                ref={containerRef}
                className="relative bg-neutral-950"
                style={{ width: cardWidth, height: scaledHeight }}
            >
                {url ? (
                    <div
                        style={{
                            width: device.width,
                            height: device.height,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <iframe
                            src={url}
                            width={device.width}
                            height={device.height}
                            className="border-0"
                            title={device.name}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-neutral-600 text-sm">
                        Enter a URL above
                    </div>
                )}
            </div>
        </div>
    )
}