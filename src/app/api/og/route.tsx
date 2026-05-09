import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const variant = (searchParams.get('variant') ?? 'A').toUpperCase()
  const page = searchParams.get('page') ?? 'home'
  const variantLower = variant.toLowerCase()
  
  // 1. ページ専用の画像があるか確認 (例: variant-a-about.png)
  let bgPath = path.join(process.cwd(), 'public', 'og', `variant-${variantLower}-${page}.png`)
  
  // 2. なければ共通の背景画像を使用 (例: variant-a-bg.png)
  if (!fs.existsSync(bgPath)) {
    bgPath = path.join(process.cwd(), 'public', 'og', `variant-${variantLower}-bg.png`)
  }

  try {
    if (fs.existsSync(bgPath)) {
      const data = fs.readFileSync(bgPath)
      return new NextResponse(data, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': data.length.toString(),
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
  } catch (error) {
    console.error('Error serving OG image:', error)
  }

  return new NextResponse('Not Found', { status: 404 })
}
