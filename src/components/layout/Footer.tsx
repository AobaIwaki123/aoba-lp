import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/about', label: '会社について' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/privacy-policy', label: 'プライバシーポリシー' },
] as const

export function Footer() {
  return (
    <footer
      className="border-t border-[--color-border-brand] bg-[--color-bg-subtle]"
      aria-label="フッター"
    >
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col items-center gap-6">
        <p className="font-bold text-xl text-[--color-text]">Jobify</p>

        <nav aria-label="フッターナビゲーション">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-base text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-[--color-text-muted]">
          &copy; {new Date().getFullYear()} Jobify. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
