'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navigation } from './Navigation'
import { cn } from '@/lib/utils'

export function Header({ primaryCta }: { primaryCta: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
        scrolled
          ? 'bg-[--color-bg]/80 backdrop-blur-md border-b border-[--color-border-brand]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-2xl text-[--color-text] hover:text-[--color-brand] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm outline-none"
          aria-label="ホームへ戻る"
        >
          Jobify
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Navigation />
          <Button
            asChild
            size="sm"
            className="bg-[--color-brand] text-white hover:bg-[--color-brand-dark]"
          >
            <Link href="/contact">{primaryCta}</Link>
          </Button>
        </div>

        {/* Mobile: placeholder — Sheet実装はPhase 3以降 */}
        <button
          className="md:hidden p-2 text-[--color-text-muted] focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm outline-none"
          aria-label="メニューを開く"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>
    </header>
  )
}
