import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: '利用は本当に無料ですか？',
    a: '転職希望者の方は完全無料でご利用いただけます。費用は採用企業様からの成功報酬のみです。',
  },
  {
    q: '在職中でも利用できますか？',
    a: 'はい、在職中の方が多数ご利用されています。面談や求人紹介はオンラインで実施するため、お仕事の合間にご相談いただけます。',
  },
  {
    q: '登録から転職完了まで何日かかりますか？',
    a: '平均3ヶ月ほどですが、最短2週間での転職成功事例もあります。ご希望のペースで進められます。',
  },
  {
    q: 'どんな業界・職種に対応していますか？',
    a: 'IT・メーカー・コンサル・金融など幅広い業界に対応。エンジニア・営業・マーケター・管理職などあらゆる職種の求人をご用意しています。',
  },
] as const

export function FAQSection() {
  return (
    <section className="py-20" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <h2
          className="heading-ja text-center font-bold mb-12 mx-auto"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            color: 'var(--color-text)',
            lineHeight: 'var(--leading-heading)',
            letterSpacing: 'var(--tracking-heading)',
            maxWidth: 'var(--measure-h2)',
          }}
        >
          よくある質問
        </h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger style={{ color: 'var(--color-text)' }}>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent style={{ color: 'var(--color-text-muted)' }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
