import { useEffect, useState } from 'react'
import type { Device } from '../data/devices'

interface Props {
    device: Device
    url: string
    cardWidth: number
    onRemove?: (id: string) => void
}

export default function DeviceFrame({ device, url, cardWidth, onRemove }: Props) {
    const [rotated, setRotated] = useState(false)
    const [scale, setScale] = useState(0.25)

    const effectiveWidth = rotated ? device.height : device.width
    const effectiveHeight = rotated ? device.width : device.height

    useEffect(() => {
        setScale(cardWidth / effectiveWidth)
    }, [cardWidth, effectiveWidth])

    const scaledHeight = effectiveHeight * scale
    const canRotate = device.category === 'tablet' || device.category === 'phone'

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
                <span className="text-sm font-medium text-neutral-200">{device.name}</span>
                <div className="flex items-center gap-3">
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
                {url ? (
                    <div
                        style={{
                            width: effectiveWidth,
                            height: effectiveHeight,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <iframe
                            src={url}
                            width={effectiveWidth}
                            height={effectiveHeight}
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