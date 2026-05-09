'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { VariantConfig } from '@/lib/variants/config'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const FloatingRings = dynamic(
  () => import('@/components/canvas/FloatingRings'),
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
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-purple-500/30 animate-ping" />
            </div>
          }>
            <FloatingRings />
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
            className="text-sm tracking-widest uppercase mb-6 font-bold"
            style={{ color: isDesktop ? 'var(--color-accent)' : 'rgba(255,255,255,0.8)' }}
          >
            ハイクラス特化型
          </p>
          <h1
            className="heading-ja font-black mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: isDesktop ? 'var(--color-text)' : '#ffffff',
              lineHeight: 'var(--leading-hero)',
              letterSpacing: 'var(--tracking-hero)',
              maxWidth: 'var(--measure-hero)',
            }}
          >
            {config.heroHeadline}
          </h1>
          <p
            className="body-ja text-lg mb-10 mx-auto md:mx-0"
            style={{ 
              color: isDesktop ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.9)',
              lineHeight: 'var(--leading-body)',
              letterSpacing: 'var(--tracking-body)',
              maxWidth: 'var(--measure-prose)',
            }}
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
          </div>
        </div>
        <div className="md:w-1/2">
          {/* Desktop canvas goes here via absolute positioning */}
        </div>
      </div>
    </section>
  )
}
