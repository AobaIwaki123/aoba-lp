import { cookies } from 'next/headers'
import type { Variant } from '@/lib/variants/types'
import { variantConfig } from '@/lib/variants/config'

export default async function LandingPage() {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const config = variantConfig[variant]

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <p className="text-xs tracking-widest uppercase text-[--color-text-muted]">
        Variant {variant} — {config.font}
      </p>
      <h1
        className="text-center font-extrabold"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-text)' }}
      >
        {config.heroHeadline}
      </h1>
      <p
        className="max-w-xl text-center"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {config.heroSubcopy}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <a
          href="/contact"
          className="px-6 py-3 rounded-lg text-white font-semibold transition-colors"
          style={{ background: 'var(--color-brand)' }}
        >
          {config.primaryCta}
        </a>
        <a
          href="/contact"
          className="px-6 py-3 rounded-lg font-semibold border transition-colors"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-border-brand)',
          }}
        >
          {config.secondaryCta}
        </a>
      </div>
      <p
        className="text-xs mt-8"
        style={{ color: 'var(--color-text-muted)' }}
      >
        Phase 3 でセクション実装予定
      </p>
    </div>
  )
}
