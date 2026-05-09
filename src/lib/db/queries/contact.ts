import { eq } from 'drizzle-orm'
import { db } from '../index'
import { contactSubmissions } from '../schema'
import type { NewContactSubmission } from '../schema'

export async function insertContact(data: NewContactSubmission) {
  // メールアドレスを小文字に正規化（名寄せコストの削減）
  const normalizedData = {
    ...data,
    email: data.email.toLowerCase(),
  }

  // Idempotency: idempotencyKey がある場合は ON CONFLICT DO NOTHING で重複送信を防ぐ
  if (normalizedData.idempotencyKey) {
    const [inserted] = await db
      .insert(contactSubmissions)
      .values(normalizedData)
      .onConflictDoNothing({ target: contactSubmissions.idempotencyKey })
      .returning()

    if (inserted) return inserted

    // 重複した場合は既存のレコードを返す
    const [existing] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.idempotencyKey, normalizedData.idempotencyKey))
      .limit(1)

    return existing
  }

  const [inserted] = await db
    .insert(contactSubmissions)
    .values(normalizedData)
    .returning()

  return inserted
}
