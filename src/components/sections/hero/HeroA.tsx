import Link from 'next/link'
import type { VariantConfig } from '@/lib/variants/config'

type Props = { config: VariantConfig }

export function HeroA({ config }: Props) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, var(--color-brand-light) 0%, transparent 70%)',
          opacity: 0.15,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p
          className="text-xs tracking-widest uppercase mb-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          AI × 人材マッチング
        </p>
        <h1
          className="font-extrabold mb-6 leading-tight"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: 'var(--color-text)',
          }}
        >
          {config.heroHeadline}
        </h1>
        <p
          className="text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {config.heroSubcopy}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-brand)' }}
          >
            {config.primaryCta}
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 rounded-lg font-semibold text-base border transition-colors hover:bg-[--color-bg-subtle]"
            style={{
              color: 'var(--color-text)',
              borderColor: 'var(--color-border-brand)',
            }}
          >
            {config.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
