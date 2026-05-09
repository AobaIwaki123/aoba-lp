import { test, expect } from '@playwright/test'

// CON-01〜05: お問い合わせフォームの正常系・バリデーション・ハニーポット
test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { name: 'お問い合わせ', level: 1 })).toBeVisible()
  })

  test('CON-01: happy path submits and redirects to success page', async ({ page }) => {
    await page.fill('input[name="name"]', 'テスト 太郎')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="subject"]', 'E2Eテスト')
    await page.fill('textarea[name="body"]', 'これはPlaywrightによるE2Eテストからの送信です。')
    await page.locator('[role="checkbox"]').click()
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('/contact/success', { timeout: 10000 })
    await expect(page.getByRole('heading', { name: '送信が完了しました' })).toBeVisible()
  })

  test('CON-02: empty submit shows name validation error', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByText('お名前を入力してください')).toBeVisible()
  })

  test('CON-03: invalid email shows email validation error', async ({ page }) => {
    await page.fill('input[name="name"]', 'テスト 太郎')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="subject"]', '件名テスト')
    await page.fill('textarea[name="body"]', '本文テスト')
    await page.locator('[role="checkbox"]').click()
    await page.locator('button[type="submit"]').click()
    await expect(page.getByText('有効なメールアドレスを入力してください')).toBeVisible()
  })

  test('CON-04: submit without agreeing to privacy policy shows error', async ({ page }) => {
    await page.fill('input[name="name"]', 'テスト 太郎')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="subject"]', '件名テスト')
    await page.fill('textarea[name="body"]', '本文テスト')
    // チェックボックスをクリックしない
    await page.locator('button[type="submit"]').click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('CON-05: honeypot filled by bot → silent success redirect', async ({ page }) => {
    await page.fill('input[name="name"]', 'テスト 太郎')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="subject"]', 'スパムテスト')
    await page.fill('textarea[name="body"]', 'ボット送信テスト')
    // hidden ハニーポットフィールドに値を入れる（ボットが全フィールドを埋める挙動）
    await page.evaluate(() => {
      const field = document.querySelector('input[name="website"]') as HTMLInputElement
      if (field) field.value = 'http://spam.example.com'
    })
    await page.locator('[role="checkbox"]').click()
    await page.locator('button[type="submit"]').click()
    // サーバーはハニーポット検知でサイレントに { success: true, id: 'honeypot' } を返す
    await page.waitForURL('/contact/success', { timeout: 10000 })
  })
})
