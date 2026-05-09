import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { Variant } from '@/lib/variants/types'

export async function generateMetadata(): Promise<Metadata> {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const v = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'dev'
  const title = '会社について'
  const description = 'はたらく人の可能性を広げる。テクノロジーと人の力で最適な出会いを創出します。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{
        url: `${siteUrl}/api/og?variant=${variant}&page=about&v=${v}`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      title,
      description,
      images: [`${siteUrl}/api/og?variant=${variant}&page=about&v=${v}`],
    },
  }
}

const company = [
  { label: '会社名', value: '株式会社ジョビファイ（モック）' },
  { label: '設立', value: '2020年4月' },
  { label: '所在地', value: '東京都渋谷区' },
  { label: '事業内容', value: '求人情報サービス / キャリア支援' },
]

const team = [
  { name: '山田 太郎', role: '代表取締役', initials: 'YT' },
  { name: '鈴木 花子', role: 'CTO', initials: 'SH' },
  { name: '田中 一郎', role: 'VP of Sales', initials: 'TI' },
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Mission */}
      <section
        className="py-28 text-center"
        style={{ background: 'var(--color-bg-subtle)' }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <p
            className="text-xs tracking-widest uppercase mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Mission
          </p>
          <h1
            className="heading-ja font-extrabold mb-6 mx-auto"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-text)',
              lineHeight: 'var(--leading-hero)',
              letterSpacing: 'var(--tracking-hero)',
              maxWidth: 'var(--measure-hero)',
            }}
          >
            はたらく人の、<br />可能性を広げる。
          </h1>
          <p
            className="body-ja text-lg mx-auto"
            style={{ 
              color: 'var(--color-text-muted)',
              lineHeight: 'var(--leading-body)',
              letterSpacing: 'var(--tracking-body)',
              maxWidth: 'var(--measure-prose)',
            }}
          >
            求人マッチングの民主化をミッションに、テクノロジーと人の力で
            最適な出会いを創出します。
          </p>
        </div>
      </section>

      {/* 会社概要 */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2
            className="font-bold mb-8"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              color: 'var(--color-text)',
            }}
          >
            会社概要
          </h2>
          <dl
            className="divide-y"
            style={{ borderColor: 'var(--color-border-brand)' }}
          >
            {company.map(({ label, value }) => (
              <div key={label} className="flex gap-8 py-5">
                <dt
                  className="w-32 shrink-0 text-sm font-semibold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {label}
                </dt>
                <dd className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* チーム */}
      <section
        className="py-20"
        style={{ background: 'var(--color-bg-subtle)' }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="heading-ja font-bold mb-14 text-center mx-auto"
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              color: 'var(--color-text)',
              lineHeight: 'var(--leading-heading)',
              letterSpacing: 'var(--tracking-heading)',
              maxWidth: 'var(--measure-h2)',
            }}
          >
            チーム
          </h2>
          <ul className="grid sm:grid-cols-3 gap-10 text-center">
            {team.map(({ name, role, initials }) => (
              <li key={name}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4"
                  style={{ background: 'var(--color-brand)' }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <p
                  className="font-semibold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {name}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
