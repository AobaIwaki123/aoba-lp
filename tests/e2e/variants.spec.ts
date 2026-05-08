import { test, expect } from '@playwright/test'

test('A/B Test Variants', async ({ page }) => {
  // Test Variant A
  await page.goto('/?__variant=A')
  await expect(page.getByRole('heading', { name: '人と企業の、最適な出会いを。' })).toBeVisible()

  // Test Variant B
  await page.goto('/?__variant=B')
  await expect(page.getByRole('heading', { name: '次のキャリアは、ここから始まる。' })).toBeVisible()

  // Test Variant C
  await page.goto('/?__variant=C')
  await expect(page.getByRole('heading', { name: 'あなたの可能性を、一緒に広げよう。' })).toBeVisible()
})
