import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const BASE_URL = process.env.OG_BASE_URL ?? 'http://localhost:3000'
const OUT_DIR = path.join(process.cwd(), 'public/og')

const VARIANTS = [
  { slug: 'a', filename: 'variant-a-bg.png' },
  { slug: 'b', filename: 'variant-b-bg.png' },
  { slug: 'c', filename: 'variant-c-bg.png' },
]

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })

  for (const { slug, filename } of VARIANTS) {
    await page.goto(`${BASE_URL}/og/${slug}`, { waitUntil: 'networkidle' })
    // Three.js が描画完了するまで待機
    await page.waitForTimeout(2500)
    await page.screenshot({ path: path.join(OUT_DIR, filename), type: 'png' })
    console.log(`Generated: ${filename}`)
  }

  await browser.close()
}

main().catch(console.error)
