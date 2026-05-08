import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const jobseeker = [
  {
    title: 'AI マッチング',
    desc: '経歴・希望条件を入力するだけで、最適な求人をリアルタイムに提案',
  },
  {
    title: '専任アドバイザー',
    desc: '業界に精通したキャリアアドバイザーが応募から内定まで伴走',
  },
  {
    title: '非公開求人',
    desc: '一般公開されていないプレミアム求人を30,000件以上保有',
  },
]

const employer = [
  {
    title: '候補者データベース',
    desc: '登録者5万名超のデータベースから条件に合う候補者を即スクリーニング',
  },
  {
    title: '採用ブランディング支援',
    desc: '企業の魅力を最大化する求人票・採用ページ制作をサポート',
  },
  {
    title: '費用対効果保証',
    desc: '採用成功報酬型のため、採用が決まるまで初期費用0円',
  },
]

export function ServicesSection() {
  return (
    <section className="py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-center font-bold mb-4"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: 'var(--color-text)',
          }}
        >
          サービスの特徴
        </h2>
        <p
          className="text-center mb-10"
          style={{ color: 'var(--color-text-muted)' }}
        >
          転職希望者と採用企業、両者に価値を提供します
        </p>
        <Tabs defaultValue="jobseeker">
          <TabsList className="mx-auto mb-10 flex w-fit">
            <TabsTrigger value="jobseeker">転職希望者の方</TabsTrigger>
            <TabsTrigger value="employer">採用企業の方</TabsTrigger>
          </TabsList>
          <TabsContent value="jobseeker">
            <div className="grid sm:grid-cols-3 gap-8">
              {jobseeker.map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-xl border"
                  style={{
                    borderColor: 'var(--color-border-brand)',
                    background: 'var(--color-bg-subtle)',
                  }}
                >
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="employer">
            <div className="grid sm:grid-cols-3 gap-8">
              {employer.map(({ title, desc }) => (
                <div
                  key={title}
                  className="p-6 rounded-xl border"
                  style={{
                    borderColor: 'var(--color-border-brand)',
                    background: 'var(--color-bg-subtle)',
                  }}
                >
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
