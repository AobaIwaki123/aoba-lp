'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { VariantConfig } from '@/lib/variants/config'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const WireframeIcosahedron = dynamic(
  () => import('@/components/canvas/WireframeIcosahedron'),
  { ssr: false }
)

type Props = { config: VariantConfig }

export function HeroB({ config }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: isDesktop ? 'var(--color-bg)' : config.mobileGradient }}
    >
      {isDesktop && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
              <div className="w-32 h-32 border border-purple-500/30 rotate-45 animate-pulse" />
            </div>
          }>
            <WireframeIcosahedron />
          </Suspense>
        </div>
      )}
      {!isDesktop && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="white" strokeWidth="1" />
            <polygon points="50,5 50,95" stroke="white" strokeWidth="1" />
            <polygon points="5,25 95,75" stroke="white" strokeWidth="1" />
            <polygon points="5,75 95,25" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <p
            className="text-xs tracking-widest uppercase mb-6 font-bold"
            style={{ color: isDesktop ? 'var(--color-accent)' : 'rgba(255,255,255,0.8)' }}
          >
            ハイクラス特化型
          </p>
          <h1
            className="font-extrabold mb-6 leading-tight tracking-tighter"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: isDesktop ? 'var(--color-text)' : '#ffffff',
            }}
          >
            {config.heroHeadline}
          </h1>
          <p
            className="text-lg mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed"
            style={{ color: isDesktop ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.9)' }}
          >
            {config.heroSubcopy}
          </p>
          <div className="flex gap-4 justify-center md:justify-start flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-lg font-bold text-base transition-transform hover:scale-105 shadow-lg"
              style={{ 
                background: isDesktop ? 'var(--color-primary)' : '#ffffff',
                color: isDesktop ? '#ffffff' : 'var(--color-primary-dark)'
              }}
            >
              {config.primaryCta}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-lg font-bold text-base border transition-colors"
              style={{
                color: isDesktop ? 'var(--color-text)' : '#ffffff',
                borderColor: isDesktop ? 'var(--color-border)' : 'rgba(255,255,255,0.3)',
                background: isDesktop ? 'transparent' : 'rgba(255,255,255,0.1)'
              }}
            >
              {config.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          {/* Desktop canvas goes here via absolute positioning */}
        </div>
      </div>
    </section>
  )
}
