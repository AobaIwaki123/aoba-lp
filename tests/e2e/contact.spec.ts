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

  // Click terms checkbox
  await page.click('button[role="checkbox"]') // shadcn Checkbox uses role="checkbox" on a button

  // Submit form
  await page.click('button[type="submit"]')

  // Assert redirection and success message
  await page.waitForURL('/contact/success')
  await expect(page.getByRole('heading', { name: '送信が完了しました' })).toBeVisible()
})
