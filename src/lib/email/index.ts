import { Resend } from 'resend'
import { AdminNotificationEmail } from './templates/admin-notification'
import { AutoReplyEmail } from './templates/auto-reply'
import type { ContactSubmission } from '../db/schema'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key')

export async function sendNotification(contact: ContactSubmission) {
  try {
    const adminEmail = process.env.CONTACT_EMAIL || 'admin@example.com'
    const fromEmail = `noreply@${process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '').replace('http://', '') || 'example.com'}`

    // 1. Admin Notification
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[求人サービス] 新規お問い合わせ: ${contact.subject}`,
      react: AdminNotificationEmail({ contact }),
    })

    // 2. Auto Reply
    await resend.emails.send({
      from: fromEmail,
      to: contact.email,
      subject: 'お問い合わせを受け付けました',
      react: AutoReplyEmail({ contact }),
    })
  } catch (error) {
    console.error('Failed to send email notification:', error)
    // ログには残すが、投稿処理自体は失敗させない
  }
}
