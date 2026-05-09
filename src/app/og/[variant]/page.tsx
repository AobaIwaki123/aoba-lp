import { notFound } from 'next/navigation'
import { OgCanvas } from './OgCanvas'

const OG_CONFIGS = {
  a: { bg: '#0f172a', textColor: '#ffffff', headline: '人と企業の、最適な出会いを。' },
  b: { bg: '#09090b', textColor: '#ffffff', headline: '次のキャリアは、ここから始まる。' },
  c: { bg: '#fffbf5', textColor: '#1c1917', headline: 'あなたの可能性を、一緒に広げよう。' },
} as const

export const metadata = { robots: 'noindex' }

export default async function OGPreviewPage({ params }: { params: Promise<{ variant: string }> }) {
  const resolvedParams = await params
  const cfg = OG_CONFIGS[resolvedParams.variant as keyof typeof OG_CONFIGS]
  if (!cfg) notFound()

  return (
    <div style={{ width: 1200, height: 630, position: 'relative', overflow: 'hidden', background: cfg.bg }}>
      <OgCanvas variant={resolvedParams.variant} />
      {/* テキストオーバーレイ */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', padding: '0 80px', color: cfg.textColor }}>
        <p style={{ fontSize: 18, marginBottom: 24, opacity: 0.7 }}>AI × 人材マッチングサービス</p>
        <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, maxWidth: 700 }}>
          {cfg.headline}
        </h1>
        <p style={{ fontSize: 22, marginTop: 32, opacity: 0.8 }}>Jobify</p>
      </div>
    </div>
  )
}
