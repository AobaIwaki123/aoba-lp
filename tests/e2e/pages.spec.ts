import { test, expect } from '@playwright/test'

// PAG-01〜03: About ページ
test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('PAG-01: shows mission heading', async ({ page }) => {
    // <br /> を含む見出しのため name に部分マッチで確認
    await expect(page.getByRole('heading', { name: /はたらく人の/, level: 1 })).toBeVisible()
  })

  test('PAG-02: shows company overview with data', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '会社概要' })).toBeVisible()
    await expect(page.getByText('株式会社ジョビファイ（モック）')).toBeVisible()
  })

  test('PAG-03: shows team section with members', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'チーム' })).toBeVisible()
    await expect(page.getByText('山田 太郎')).toBeVisible()
    await expect(page.getByText('鈴木 花子')).toBeVisible()
  })
})

// PAG-04〜06: プライバシーポリシーページ
test.describe('Privacy Policy page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy-policy')
  })

  test('PAG-04: shows page title', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'プライバシーポリシー', level: 1 })
    ).toBeVisible()
  })

  test('PAG-05: shows all 6 required sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '1. 個人情報取扱事業者' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '2. 利用目的' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '3. 第三者提供・業務委託先（外部送信規律）' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '4. Cookie（外部送信規律）' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: '5. 保持期間' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: '6. 開示・訂正・利用停止等の請求' })
    ).toBeVisible()
  })

  test('PAG-06: lists external data recipients', async ({ page }) => {
    await expect(page.getByText('Neon (Postgres)')).toBeVisible()
    await expect(page.getByText('Resend')).toBeVisible()
    await expect(page.getByText('Upstash (Redis)')).toBeVisible()
  })
})

// PAG-07〜08: 送信完了ページ
test.describe('Contact success page', () => {
  test('PAG-07: shows confirmation heading', async ({ page }) => {
    await page.goto('/contact/success')
    await expect(page.getByRole('heading', { name: '送信が完了しました' })).toBeVisible()
  })

  test('PAG-08: "トップページに戻る" link navigates to /', async ({ page }) => {
    await page.goto('/contact/success')
    await page.getByRole('link', { name: 'トップページに戻る' }).click()
    await expect(page).toHaveURL('/')
  })
})
