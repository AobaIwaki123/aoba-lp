'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import type { VariantConfig } from '@/lib/variants/config'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const FloatingSpheres = dynamic(
  () => import('@/components/canvas/FloatingSpheres'),
  { ssr: false }
)

type Props = { config: VariantConfig }

export function HeroC({ config }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: isDesktop ? 'var(--color-bg)' : config.mobileGradient }}
    >
      {isDesktop && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="w-full h-full bg-[#fffbf5] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-400/40 animate-ping" />
            </div>
          }>
            <FloatingSpheres />
          </Suspense>
        </div>
      )}
      {!isDesktop && (
        <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center overflow-hidden">
          <div className="w-64 h-64 bg-white/20 rounded-full mix-blend-overlay animate-[float_6s_ease-in-out_infinite]" />
          <div className="absolute w-48 h-48 bg-amber-300/30 rounded-full mix-blend-overlay animate-[float_8s_ease-in-out_infinite_reverse]" style={{ right: '-10%', top: '20%' }} />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1
          className="font-extrabold mb-8 leading-tight tracking-tight"
          style={{
            fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
            color: isDesktop ? 'var(--color-text)' : '#ffffff',
          }}
        >
          {config.heroHeadline}
        </h1>
        <p
          className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: isDesktop ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.95)' }}
        >
          {config.heroSubcopy}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="px-10 py-5 rounded-full font-semibold text-base transition-transform hover:-translate-y-1 shadow-lg"
            style={{ 
              background: isDesktop ? 'var(--color-primary)' : '#ffffff',
              color: isDesktop ? '#ffffff' : 'var(--color-primary-dark)'
            }}
          >
            {config.primaryCta}
          </Link>
          <Link
            href="/contact"
            className="px-10 py-5 rounded-full font-semibold text-base border transition-colors"
            style={{
              color: isDesktop ? 'var(--color-text)' : '#ffffff',
              borderColor: isDesktop ? 'var(--color-border)' : 'rgba(255,255,255,0.4)',
              background: isDesktop ? 'transparent' : 'rgba(255,255,255,0.15)'
            }}
          >
            {config.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
