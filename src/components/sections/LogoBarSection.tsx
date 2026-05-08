const logos = [
  '株式会社テックビジョン',
  'グローバルエンタープライズ',
  'フューチャーキャリア',
  'スマートワークス',
  'ネクストステージ',
  'イノベーション・パートナーズ',
]

export function LogoBarSection() {
  return (
    <section
      className="py-12 overflow-hidden border-y"
      style={{
        borderColor: 'var(--color-border-brand)',
        background: 'var(--color-bg)',
      }}
    >
      <p
        className="text-center text-xs tracking-widest uppercase mb-6"
        style={{ color: 'var(--color-text-muted)' }}
      >
        導入企業
      </p>
      <div
        className="marquee-container relative flex overflow-hidden"
        aria-label="導入企業一覧"
      >
        <ul
          className="marquee flex gap-16 items-center whitespace-nowrap"
          aria-hidden="true"
        >
          {[...logos, ...logos].map((name, i) => (
            <li
              key={i}
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
      <ul className="sr-only">
        {logos.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  )
}
