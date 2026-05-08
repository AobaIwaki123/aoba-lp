const steps = [
  {
    num: '01',
    title: '無料登録',
    desc: '3分で完了。経歴と希望条件を入力するだけ',
  },
  {
    num: '02',
    title: 'マッチング',
    desc: 'AIが最適な求人を選定。アドバイザーが精査してご提案',
  },
  {
    num: '03',
    title: '内定・入社',
    desc: '面接対策から条件交渉まで、入社日まで完全サポート',
  },
] as const

export function HowItWorksSection() {
  return (
    <section className="py-20" style={{ background: 'var(--color-bg-subtle)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-center font-bold mb-16"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: 'var(--color-text)',
          }}
        >
          ご利用の流れ
        </h2>
        <ol className="grid sm:grid-cols-3 gap-10 text-center">
          {steps.map(({ num, title, desc }) => (
            <li key={num}>
              <p
                className="text-5xl font-black mb-4"
                style={{ color: 'var(--color-brand-light)' }}
                aria-hidden="true"
              >
                {num}
              </p>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
