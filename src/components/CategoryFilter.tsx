import type { Category } from '../data/devices'

interface Props {
    selected: Category
    onSelect: (category: Category) => void
}

const CATEGORIES: { id: Category; label: string }[] = [
    { id: 'laptop', label: 'Laptops' },
    { id: 'desktop', label: 'Desktops' },
    { id: 'tablet', label: 'Tablets' },
    { id: 'phone', label: 'Phones' },
    { id: 'custom', label: 'Custom' },
]

export default function CategoryFilter({ selected, onSelect }: Props) {
    return (
        <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-800 bg-neutral-900">
            {CATEGORIES.map((cat) => {
                const isActive = cat.id === selected
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`text-sm px-3 py-1.5 rounded-lg transition ${
                            isActive
                                ? 'bg-neutral-100 text-neutral-900 font-medium'
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                    >
                        {cat.label}
                    </button>
                )
            })}
        </div>
    )
}