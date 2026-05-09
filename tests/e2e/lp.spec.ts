import { test, expect } from '@playwright/test'

// LP-01〜07: LP 共通セクションの表示確認
// バリアント A に固定して決定論的に検証する
test.describe('LP sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?__variant=A')
  })

  test('LP-01: hero headline is visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: '人と企業の、最適な出会いを。', level: 1 })
    ).toBeVisible()
  })

  test('LP-02: stats section shows key figures', async ({ page }) => {
    await expect(page.getByText('5,000社以上')).toBeVisible()
    await expect(page.getByText('50,000名以上')).toBeVisible()
    await expect(page.getByText('120,000件以上')).toBeVisible()
  })

  test('LP-03: services section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'サービスの特徴' })).toBeVisible()
  })

  test('LP-04: how it works section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ご利用の流れ' })).toBeVisible()
  })

  test('LP-05: testimonials section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ご利用者の声' })).toBeVisible()
  })

  test('LP-06: FAQ section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'よくある質問' })).toBeVisible()
  })

  test('LP-07: CTA section links to /contact', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'まず、話してみませんか。' })
    ).toBeVisible()
    // CTA リンク（ページ下部のもの）が /contact を指す
    const ctaLink = page.getByRole('link', { name: '無料で相談する' }).last()
    await expect(ctaLink).toHaveAttribute('href', '/contact')
  })
})
