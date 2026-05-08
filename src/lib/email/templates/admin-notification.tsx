import { Html, Text, Hr } from '@react-email/components'
import type { ContactSubmission } from '../../db/schema'

export function AdminNotificationEmail({ contact }: { contact: ContactSubmission }) {
  return (
    <Html>
      <Text>新規お問い合わせを受信しました。</Text>
      <Hr />
      <Text><strong>受信日時:</strong> {new Date(contact.createdAt).toLocaleString('ja-JP')}</Text>
      <Text><strong>氏名:</strong> {contact.name}</Text>
      <Text><strong>メールアドレス:</strong> {contact.email}</Text>
      <Text><strong>バリアント:</strong> {contact.variant}</Text>
      <Hr />
      <Text><strong>件名:</strong> {contact.subject}</Text>
      <Text><strong>本文:</strong></Text>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{contact.body}</Text>
      <Hr />
      <Text><a href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin`}>管理画面で確認</a></Text>
    </Html>
  )
}
