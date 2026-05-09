'use server'

import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { contactSchema } from '@/lib/validations/contact'
import { insertContact } from '@/lib/db/queries/contact'
import { sendNotification } from '@/lib/email'
import { notifySlack } from '@/lib/slack'
import type { Variant } from '@/lib/variants/types'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

// Fallback logic for local development and E2E tests where Upstash is not configured
const ratelimit = redisUrl && redisToken
  ? new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
        '1 h'
      ),
    })
  : { limit: async () => ({ success: true }) }

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function submitContact(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const ip = (await headers()).get('x-real-ip') ?? '127.0.0.1'
  
  if (ratelimit) {
    try {
      const { success: rateLimitOk } = await ratelimit.limit(ip)
      if (!rateLimitOk) {
        after(() => notifySlack(`⚠️ レート制限超過: IP=${ip}`))
        return { success: false, error: 'しばらく時間をおいてから再送してください' }
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      after(() => notifySlack(`❌ レート制限エラー (Fail-open): ${error instanceof Error ? error.message : String(error)}`))
      // レート制限サービスのエラー時は、可用性を優先して送信を許可する (Fail-open)
    }
  }

  if (formData.get('website')) {
    return { success: true, id: 'honeypot' }
  }

  const rawData = Object.fromEntries(formData)
  const parsed = contactSchema.safeParse({
    ...rawData,
    agreed: rawData.agreed === 'on',
  })
  
  if (!parsed.success) {
    return { 
      success: false, 
      error: '入力内容を確認してください',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const idempotencyKey = formData.get('idempotency_key') as string | undefined

  try {
    // E2Eテスト用: DATABASE_URLがダミーの場合はDB書き込みをスキップ
    if (process.env.DATABASE_URL?.includes('dummy')) {
      return { success: true, id: 'dummy-id-for-e2e-test' }
    }

    const contact = await insertContact({ 
      ...parsed.data, 
      variant, 
      ipAddress: ip,
      idempotencyKey,
    })
    after(() => sendNotification(contact))
    return { success: true, id: contact.id }
  } catch (error) {
    const cause = error instanceof Error ? (error as Error & { cause?: unknown }).cause : undefined
    const detail = cause instanceof Error ? cause.message : error instanceof Error ? error.message : String(error)
    console.error('Failed to insert contact:', error)
    after(() => notifySlack(`❌ お問い合わせ保存失敗: ${detail}`))
    return { success: false, error: '送信中にエラーが発生しました。時間をおいて再度お試しください。' }
  }
}
