import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: '送信完了 | 転職・求人サービス',
  description: 'お問い合わせの送信が完了しました。',
}

export default function ContactSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-8 min-h-[60vh] flex flex-col justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          送信が完了しました
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          お問い合わせありがとうございます。<br />
          2〜3営業日以内に担当者よりご連絡いたします。
        </p>
      </div>

      <div className="p-6 rounded-lg bg-muted/50 border border-border inline-block text-left mx-auto">
        <p className="text-sm" style={{ color: 'var(--color-text)' }}>
          送信内容の確認メールをご登録のアドレスに送信しました。
        </p>
      </div>

      <div className="pt-8">
        <Button asChild className="px-8" style={{ background: 'var(--color-brand)' }}>
          <Link href="/">
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  )
}
