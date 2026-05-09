import { test, expect } from '@playwright/test'

test('Contact form submission', async ({ page }) => {
  await page.goto('/contact')

  // Check form presence
  await expect(page.getByRole('heading', { name: 'お問い合わせ' })).toBeVisible()

  // Fill form
  await page.fill('input[name="name"]', 'テスト 太郎')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="subject"]', 'E2Eテスト')
  await page.fill('textarea[name="body"]', 'これはPlaywrightによるE2Eテストからの送信です。')

  // Wait for React hydration
  await page.waitForTimeout(1000)

  // Click terms checkbox via DOM evaluation
  await page.evaluate(() => {
    const btn = document.querySelector('button[role="checkbox"]') as HTMLButtonElement
    if (btn) btn.click()
  })

  // Wait for button to be enabled
  const submitButton = page.locator('button[type="submit"]')
  await expect(submitButton).toBeEnabled()

  // Submit form
  await submitButton.click()

  // Assert redirection and success message
  await page.waitForURL('/contact/success', { timeout: 10000 })
  await expect(page.getByRole('heading', { name: '送信が完了しました' })).toBeVisible()
})
