'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { VariantConfig } from '@/lib/variants/config'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const ParticleNetwork = dynamic(
  () => import('@/components/canvas/ParticleNetwork'),
  { ssr: false }
)

type Props = { config: VariantConfig }

export function HeroA({ config }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: isDesktop ? 'var(--color-bg)' : config.mobileGradient }}
    >
      {isDesktop && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-indigo-600 to-cyan-500 animate-pulse" />}>
            <ParticleNetwork />
          </Suspense>
        </div>
      )}
      {!isDesktop && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, var(--color-brand-light) 0%, transparent 70%)',
            opacity: 0.15,
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <p
          className="text-xs tracking-widest uppercase mb-6"
          style={{ color: isDesktop ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.8)' }}
        >
          AI × 人材マッチング
        </p>
        <h1
          className="heading-ja font-extrabold mb-6 mx-auto"
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
          className="body-ja text-lg mb-10 mx-auto"
          style={{ 
            color: isDesktop ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.9)',
            lineHeight: 'var(--leading-body)',
            letterSpacing: 'var(--tracking-body)',
            maxWidth: 'var(--measure-prose)',
          }}
        >
          {config.heroSubcopy}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-lg font-semibold text-base transition-opacity hover:opacity-90 shadow-lg"
            style={{ 
              background: isDesktop ? 'var(--color-brand)' : '#ffffff',
              color: isDesktop ? '#ffffff' : 'var(--color-brand)'
            }}
          >
            {config.primaryCta}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-lg font-semibold text-base border transition-colors"
            style={{
              color: isDesktop ? 'var(--color-text)' : '#ffffff',
              borderColor: isDesktop ? 'var(--color-border-brand)' : 'rgba(255,255,255,0.3)',
              background: isDesktop ? 'transparent' : 'rgba(255,255,255,0.1)'
            }}
          >
            {config.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
