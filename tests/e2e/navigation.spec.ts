import { test, expect } from '@playwright/test'

// NAV-01〜04: ヘッダーナビゲーション
test.describe('Header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?__variant=A')
  })

  test('NAV-01: logo is accessible link to home', async ({ page }) => {
    const logo = page.locator('header').getByRole('link', { name: 'ホームへ戻る' })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('NAV-02: "会社について" nav link navigates to /about', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'メインナビゲーション' })
      .getByRole('link', { name: '会社について' })
      .click()
    await expect(page).toHaveURL('/about')
  })

  test('NAV-03: "お問い合わせ" nav link navigates to /contact', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'メインナビゲーション' })
      .getByRole('link', { name: 'お問い合わせ' })
      .click()
    await expect(page).toHaveURL('/contact')
  })

  test('NAV-04: header CTA "無料で相談する" links to /contact', async ({ page }) => {
    const headerCta = page.locator('header').getByRole('link', { name: '無料で相談する' })
    await expect(headerCta).toBeVisible()
    await expect(headerCta).toHaveAttribute('href', '/contact')
  })
})

// NAV-05〜08: フッターナビゲーション
test.describe('Footer navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?__variant=A')
  })

  test('NAV-05: footer "会社について" link navigates to /about', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'フッターナビゲーション' })
      .getByRole('link', { name: '会社について' })
      .click()
    await expect(page).toHaveURL('/about')
  })

  test('NAV-06: footer "お問い合わせ" link navigates to /contact', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'フッターナビゲーション' })
      .getByRole('link', { name: 'お問い合わせ' })
      .click()
    await expect(page).toHaveURL('/contact')
  })

  test('NAV-07: footer "プライバシーポリシー" link navigates to /privacy-policy', async ({
    page,
  }) => {
    await page
      .getByRole('navigation', { name: 'フッターナビゲーション' })
      .getByRole('link', { name: 'プライバシーポリシー' })
      .click()
    await expect(page).toHaveURL('/privacy-policy')
  })

  test('NAV-08: copyright notice is present in footer', async ({ page }) => {
    await expect(
      page.getByRole('contentinfo').getByText('Jobify. All rights reserved.')
    ).toBeVisible()
  })
})
