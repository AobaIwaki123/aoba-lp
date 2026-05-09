import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'  // fs.readFileSync のため Node.js runtime 必須

const VARIANT_BG: Record<string, string> = {
  A: '/og/variant-a-bg.png',
  B: '/og/variant-b-bg.png',
  C: '/og/variant-c-bg.png',
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  home:    { title: '人と企業の、最適な出会いを。', description: 'AI × 人材マッチングサービス Jobify' },
  about:   { title: 'Jobify について',              description: 'はたらく人の可能性を広げる' },
  contact: { title: 'お問い合わせ',                description: 'キャリアの悩み、お気軽にご相談ください' },
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const variant = (searchParams.get('variant') ?? 'A').toUpperCase()
  const page = searchParams.get('page') ?? 'home'

  const meta = PAGE_META[page] ?? PAGE_META.home
  const bgPath = path.join(process.cwd(), 'public', VARIANT_BG[variant] ?? VARIANT_BG.A)
  
  let bgData = ''
  try {
    bgData = `data:image/png;base64,${fs.readFileSync(bgPath).toString('base64')}`
  } catch (error) {
    console.warn(`Could not read background image at ${bgPath}. Using empty background.`)
  }

  // 日本語フォント読み込み
  const fontPath = path.join(process.cwd(), 'public/fonts/NotoSansJP-Bold.ttf')
  let fontData: Buffer | null = null
  try {
    fontData = fs.readFileSync(fontPath)
  } catch (error) {
    console.warn(`Could not read font file at ${fontPath}. Text might not render correctly.`)
  }

  const textColor = variant === 'C' ? '#1c1917' : '#ffffff'
  const accentColor = variant === 'A' ? '#818cf8' : variant === 'B' ? '#d8b4fe' : '#fbbf24'

  const options: any = {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  }

  if (fontData) {
    options.fonts = [{ name: 'NotoSansJP', data: fontData, weight: 700 }]
  }

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, position: 'relative', display: 'flex' }}>
        {/* 背景 PNG */}
        {bgData && <img src={bgData} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />}
        {/* テキスト */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      justifyContent: 'center', padding: '0 80px', color: textColor }}>
          <p style={{ fontSize: 16, color: accentColor, marginBottom: 20, letterSpacing: '0.1em' }}>
            AI × 人材マッチング
          </p>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, maxWidth: 680, margin: 0 }}>
            {meta.title}
          </h1>
          <p style={{ fontSize: 20, marginTop: 28, opacity: 0.75 }}>
            {meta.description}
          </p>
          <p style={{ position: 'absolute', bottom: 48, right: 80, fontSize: 24,
                      fontWeight: 700, opacity: 0.9 }}>
            Jobify
          </p>
        </div>
      </div>
    ),
    options
  )
}
