const stats = [
  { value: '5,000社以上', label: '登録企業数' },
  { value: '50,000名以上', label: '転職成功者数' },
  { value: '120,000件以上', label: '公開求人件数' },
] as const

export function StatsSection() {
  return (
    <section className="py-20" style={{ background: 'var(--color-bg-subtle)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <dt
                className="text-4xl font-extrabold mb-2"
                style={{ color: 'var(--color-brand)' }}
              >
                {value}
              </dt>
              <dd className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
