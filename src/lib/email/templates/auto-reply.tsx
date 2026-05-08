import { Html, Text, Hr } from '@react-email/components'
import type { ContactSubmission } from '../../db/schema'

export function AutoReplyEmail({ contact }: { contact: ContactSubmission }) {
  return (
    <Html>
      <Text>{contact.name} 様</Text>
      <Text>この度はお問い合わせいただきありがとうございます。</Text>
      <Text>以下の内容でお問い合わせを受け付けました。</Text>
      <Hr />
      <Text><strong>件名:</strong> {contact.subject}</Text>
      <Text><strong>お問い合わせ内容:</strong></Text>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{contact.body}</Text>
      <Hr />
      <Text>2〜3営業日以内に担当者よりご連絡いたします。</Text>
      <Text>しばらくお待ちください。</Text>
      <Text>──────────────────</Text>
      <Text>求人サービス名（モック）</Text>
      <Text>support@example.com</Text>
      <Text>{process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}</Text>
    </Html>
  )
}
