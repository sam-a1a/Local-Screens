export type Category = 'laptop' | 'desktop' | 'tablet' | 'phone' | 'custom'

export interface Device {
    id: string
    name: string
    width: number
    height: number
    dpr: number
    category: Category
}

export const devices: Device[] = [
    { id: 'macbook-air-13', name: 'MacBook Air 13"', width: 1440, height: 900, dpr: 2, category: 'laptop' },
    { id: 'macbook-pro-14', name: 'MacBook Pro 14"', width: 1512, height: 982, dpr: 2, category: 'laptop' },
    { id: 'macbook-pro-16', name: 'MacBook Pro 16"', width: 1728, height: 1117, dpr: 2, category: 'laptop' },
    { id: 'asus-tuf-a17', name: 'Asus TUF A17', width: 1920, height: 1080, dpr: 1, category: 'laptop' },
    { id: 'dell-xps-15', name: 'Dell XPS 15', width: 1920, height: 1200, dpr: 1, category: 'laptop' },
    { id: 'imac-24', name: 'iMac 24"', width: 4480, height: 2520, dpr: 2, category: 'desktop' },
    { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 834, height: 1194, dpr: 2, category: 'tablet' },
    { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, dpr: 2, category: 'tablet' },
    { id: 'iphone-16-pro', name: 'iPhone 16 Pro', width: 402, height: 874, dpr: 3, category: 'phone' },
    { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, dpr: 2, category: 'phone' },
    { id: 'pixel-9', name: 'Pixel 9', width: 412, height: 915, dpr: 2.6, category: 'phone' },
]