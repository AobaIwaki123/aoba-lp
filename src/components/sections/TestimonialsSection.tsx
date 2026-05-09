const testimonials = [
  {
    name: '田中 恵子',
    role: 'エンジニア（転職成功）',
    initials: 'TK',
    comment:
      'アドバイザーの方がとても親身に相談に乗ってくれました。3社から内定をいただき、希望通りの職場に転職できました。',
  },
  {
    name: '鈴木 浩二',
    role: '採用責任者',
    initials: 'SK',
    comment:
      '採用工数を大幅に削減できました。マッチング精度が高く、書類選考の通過率が2倍以上になっています。',
  },
  {
    name: '山田 美咲',
    role: 'マーケター（転職成功）',
    initials: 'YM',
    comment:
      '転職が初めてで不安でしたが、丁寧なサポートのおかげで安心して活動できました。',
  },
] as const

export function TestimonialsSection() {
  return (
    <section className="py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-center font-bold mb-12"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: 'var(--color-text)',
          }}
        >
          ご利用者の声
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {testimonials.map(({ name, role, initials, comment }) => (
            <figure
              key={name}
              className="p-6 rounded-xl border"
              style={{
                borderColor: 'var(--color-border-brand)',
                background: 'var(--color-bg-subtle)',
              }}
            >
              <blockquote
                className="text-sm mb-6 leading-relaxed"
                style={{ color: 'var(--color-text)' }}
              >
                「{comment}」
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'var(--color-brand)' }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p
          className="text-center text-sm mt-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ※ 個人の体験談です。
        </p>
      </div>
    </section>
  )
}
