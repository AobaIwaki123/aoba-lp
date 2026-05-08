import type { Metadata } from 'next'
import { Inter, Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import type { Variant } from '@/lib/variants/types'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: {
    default: '求人サービス | キャリアの可能性を広げる',
    template: '%s | 求人サービス',
  },
  description:
    '5,000社以上の求人から、あなたのキャリアにぴったりの一社を見つけましょう。専任のキャリアアドバイザーが転職活動を全面サポートします。',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant

  return (
    <html
      lang="ja"
      data-variant={variant}
      className={[
        inter.variable,
        geistSans.variable,
        geistMono.variable,
        plusJakartaSans.variable,
        'h-full antialiased',
      ].join(' ')}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
