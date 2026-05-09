import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

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
  const variantLower = variant.toLowerCase()
  
  let bgSrc: string | null = null
  try {
    const bgPath = path.join(process.cwd(), 'public', 'og', `variant-${variantLower}-bg.png`)
    const buf = fs.readFileSync(bgPath)
    bgSrc = `data:image/png;base64,${buf.toString('base64')}`
  } catch (error) {
    console.warn('Could not read background image.', error)
  }

  let fontData: ArrayBuffer | null = null
  try {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Bold.ttf')
    const buf = fs.readFileSync(fontPath)
    fontData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch (error) {
    console.warn('Could not read font file.', error)
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
        {bgSrc && (
          <img src={bgSrc} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        )}
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
