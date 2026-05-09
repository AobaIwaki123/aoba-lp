import Link from 'next/link'
import type { VariantConfig } from '@/lib/variants/config'

type Props = { config: VariantConfig }

export function CTASection({ config }: Props) {
  return (
    <section
      className="py-24 text-center"
      style={{ background: 'var(--color-brand)' }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <h2
          className="heading-ja font-bold text-white mb-4 mx-auto"
          style={{ 
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 'var(--leading-heading)',
            letterSpacing: 'var(--tracking-heading)',
            maxWidth: 'var(--measure-h2)',
          }}
        >
          {config.ctaHeadline}
        </h2>
        <p className="body-ja mb-10 mx-auto" style={{ 
          color: 'rgba(255,255,255,0.8)',
          lineHeight: 'var(--leading-body)',
          letterSpacing: 'var(--tracking-body)',
          maxWidth: 'var(--measure-prose)',
        }}>
          {config.ctaSubcopy}
        </p>
        <Link
          href="/contact"
          className="inline-block px-10 py-4 rounded-lg bg-white font-bold text-base transition-opacity hover:opacity-90"
          style={{ color: 'var(--color-brand)' }}
        >
          {config.primaryCta}
        </Link>
      </div>
    </section>
  )
}
