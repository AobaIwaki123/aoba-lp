import Link from 'next/link'

const NAV_LINKS = [
  { href: '/about', label: '会社について' },
  { href: '/contact', label: 'お問い合わせ' },
] as const

export function Navigation() {
  return (
    <nav aria-label="メインナビゲーション">
      <ul className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[--color-brand] rounded-sm outline-none"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
