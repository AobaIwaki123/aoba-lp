'use client'

import { useState, useEffect } from 'react'

const VARIANTS = ['A', 'B', 'C'] as const
const COLORS = { A: '#4f46e5', B: '#a855f7', C: '#d97706' } as const

function switchVariant(v: string) {
  document.cookie = `variant=${v}; path=/; max-age=86400`
  location.reload()
}

function readVariantCookie(): string {
  return document.cookie.split(';').find(c => c.trim().startsWith('variant='))?.split('=')[1] ?? 'A'
}

export function VariantSwitcher() {
  if (process.env.NODE_ENV !== 'development') return null

  // '' on server/hydration → actual value after mount to avoid hydration mismatch
  const [current, setCurrent] = useState('')
  useEffect(() => { setCurrent(readVariantCookie()) }, [])

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-2"
      aria-label="バリアント切り替え（開発用）"
    >
      {VARIANTS.map(v => (
        <button
          key={v}
          onClick={() => switchVariant(v)}
          title={`Variant ${v}`}
          className="w-9 h-9 rounded-full text-xs font-bold text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{
            background: COLORS[v],
            opacity: current === v ? 1 : 0.5,
            outline: current === v ? '2px solid white' : 'none',
            outlineOffset: '2px',
          }}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
