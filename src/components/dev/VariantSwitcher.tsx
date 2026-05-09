'use client'

const VARIANTS = ['A', 'B', 'C'] as const
const COLORS = { A: '#4f46e5', B: '#a855f7', C: '#d97706' } as const

type Props = { currentVariant: string }

export function VariantSwitcher({ currentVariant }: Props) {
  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-2"
      aria-label="バリアント切り替え（開発用）"
    >
      {VARIANTS.map(v => (
        <button
          key={v}
          onClick={() => { location.href = `/?__variant=${v}` }}
          title={`Variant ${v}`}
          className="w-9 h-9 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{
            background: COLORS[v],
            opacity: currentVariant === v ? 1 : 0.4,
            outline: currentVariant === v ? '2px solid white' : 'none',
            outlineOffset: '2px',
          }}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
