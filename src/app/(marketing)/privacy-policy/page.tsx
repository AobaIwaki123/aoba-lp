export const metadata = {
  title: 'プライバシーポリシー | Jobify',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 prose-like">
          <h1
            className="font-extrabold mb-10"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: 'var(--color-text)',
            }}
          >
            プライバシーポリシー
          </h1>

          <Section title="1. 個人情報取扱事業者">
            <Table
              rows={[
                ['名称', '株式会社〇〇（本番時に差し替え）'],
                ['住所', '〇〇都〇〇区（本番時に差し替え）'],
                ['代表者', '代表取締役 〇〇 〇〇（本番時に差し替え）'],
                ['問い合わせ窓口', 'privacy@example.com（本番時に差し替え）'],
              ]}
            />
          </Section>

          <Section title="2. 利用目的">
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <li>お問い合わせへの対応および回答</li>
              <li>サービス品質改善のための統計分析（個人を特定しない形で利用）</li>
            </ul>
          </Section>

          <Section title="3. 第三者提供・業務委託先（外部送信規律）">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: 'var(--color-bg-subtle)' }}>
                    {['委託先', '送信する情報', '目的'].map((h) => (
                      <th key={h} className="text-left p-3 border" style={{ borderColor: 'var(--color-border-brand)', color: 'var(--color-text)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Neon (Postgres)', '氏名・メール・お問い合わせ内容・IP', 'データ保管'],
                    ['Resend', '氏名・メールアドレス', 'メール送信'],
                    ['Upstash (Redis)', 'IPアドレス', 'レート制限（スパム防止）'],
                    ['Vercel', 'アクセスログ（IP含む）', 'ホスティング・CDN'],
                  ].map(([name, info, purpose]) => (
                    <tr key={name}>
                      <td className="p-3 border" style={{ borderColor: 'var(--color-border-brand)', color: 'var(--color-text)' }}>{name}</td>
                      <td className="p-3 border" style={{ borderColor: 'var(--color-border-brand)', color: 'var(--color-text-muted)' }}>{info}</td>
                      <td className="p-3 border" style={{ borderColor: 'var(--color-border-brand)', color: 'var(--color-text-muted)' }}>{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              これらは利用目的の達成に必要な範囲での業務委託であり、第三者提供には該当しません。
            </p>
          </Section>

          <Section title="4. Cookie（外部送信規律）">
            <Table
              rows={[
                ['Cookie名', '保持期間', '目的'],
                ['variant', '30日', 'A/Bテスト（デザインバリアント割り当て）'],
              ]}
              hasHeader
            />
          </Section>

          <Section title="5. 保持期間">
            <Table
              rows={[
                ['データ', '保持期間'],
                ['お問い合わせ内容・氏名・メール', '最終更新から3年'],
                ['IPアドレス', '収集から90日後にNULL化'],
                ['スパム判定レコード', '判定から30日後に削除'],
              ]}
              hasHeader
            />
          </Section>

          <Section title="6. 開示・訂正・利用停止等の請求">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              上記1の問い合わせ窓口へメールにてご連絡ください。
              本人確認書類の提出をお願いする場合があります。
            </p>
          </Section>
        </div>
      </section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="font-bold text-lg mb-4 pb-2 border-b"
        style={{
          color: 'var(--color-text)',
          borderColor: 'var(--color-border-brand)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Table({
  rows,
  hasHeader = false,
}: {
  rows: string[][]
  hasHeader?: boolean
}) {
  const header = hasHeader ? rows[0] : null
  const body = hasHeader ? rows.slice(1) : rows
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        {header && (
          <thead>
            <tr style={{ background: 'var(--color-bg-subtle)' }}>
              {header.map((h) => (
                <th
                  key={h}
                  className="text-left p-3 border"
                  style={{
                    borderColor: 'var(--color-border-brand)',
                    color: 'var(--color-text)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="p-3 border"
                  style={{
                    borderColor: 'var(--color-border-brand)',
                    color: j === 0 ? 'var(--color-text)' : 'var(--color-text-muted)',
                    fontWeight: j === 0 ? 500 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
