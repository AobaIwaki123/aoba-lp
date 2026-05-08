import { ContactForm } from '@/components/forms/ContactForm'

export const metadata = {
  title: 'お問い合わせ | Jobify',
  description: 'キャリアのご相談、採用に関するお問い合わせはこちらから。',
}

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <p
            className="text-center text-xs tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Contact
          </p>
          <h1
            className="text-center font-extrabold mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--color-text)',
            }}
          >
            お問い合わせ
          </h1>
          <p
            className="text-center mb-12"
            style={{ color: 'var(--color-text-muted)' }}
          >
            キャリアのご相談、採用に関するご質問など、お気軽にご連絡ください。
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
