import { test, expect } from '@playwright/test'

// VAR-01〜08: A/B テストバリアントのコピー・CTA・Cookie 動作確認
test.describe('A/B test variants', () => {
  test('VAR-01/02: Variant A shows correct headline and CTA', async ({ page }) => {
    await page.goto('/?__variant=A')
    await expect(
      page.getByRole('heading', { name: '人と企業の、最適な出会いを。', level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'まず、話してみませんか。' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: '無料で相談する' }).last()).toBeVisible()
  })

  test('VAR-03/04: Variant B shows correct headline and CTA', async ({ page }) => {
    await page.goto('/?__variant=B')
    await expect(
      page.getByRole('heading', { name: '次のキャリアは、ここから始まる。', level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '今が、動くタイミングだ。' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: '今すぐ始める' })).toBeVisible()
  })

  test('VAR-05/06: Variant C shows correct headline and CTA', async ({ page }) => {
    await page.goto('/?__variant=C')
    await expect(
      page.getByRole('heading', { name: 'あなたの可能性を、一緒に広げよう。', level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '一緒に、次のステップを考えよう。' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'まずは話を聞いてみる' })).toBeVisible()
  })

  test('VAR-07: variant cookie is set on first visit (A or C only — B is inactive)', async ({
    page,
    context,
  }) => {
    await context.clearCookies()
    await page.goto('/')
    const cookies = await context.cookies()
    const variantCookie = cookies.find((c) => c.name === 'variant')
    expect(variantCookie).toBeDefined()
    // アクティブバリアントは A と C のみ（proxy.ts: ACTIVE_VARIANTS = ['A', 'C']）
    expect(['A', 'C']).toContain(variantCookie?.value)
  })

  test('VAR-08: forced variant cookie persists on reload', async ({ page, context }) => {
    await page.goto('/?__variant=B')
    await page.reload()
    const cookies = await context.cookies()
    const variantCookie = cookies.find((c) => c.name === 'variant')
    expect(variantCookie?.value).toBe('B')
    await expect(
      page.getByRole('heading', { name: '次のキャリアは、ここから始まる。', level: 1 })
    ).toBeVisible()
  })
})
