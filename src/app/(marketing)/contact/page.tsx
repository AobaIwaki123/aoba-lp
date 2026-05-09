import { ContactForm } from '@/components/forms/ContactForm'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { Variant } from '@/lib/variants/types'

export async function generateMetadata(): Promise<Metadata> {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const title = 'お問い合わせ'
  const description = 'キャリアの悩みをお気軽にご相談ください。無料相談はこちらから。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{
        url: `${siteUrl}/api/og?variant=${variant}&page=contact`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      title,
      description,
      images: [`${siteUrl}/api/og?variant=${variant}&page=contact`],
    },
  }
}

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <p
            className="text-center text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Contact
          </p>
          <h1
            className="text-center font-extrabold mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-text)',
            }}
          >
            お問い合わせ
          </h1>
          <p
            className="text-center mb-12"
            style={{ color: 'var(--color-text-muted)' }}
          >
            キャリアのご相談、採用に関するご質問など、お気軽にご連絡ください。
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
