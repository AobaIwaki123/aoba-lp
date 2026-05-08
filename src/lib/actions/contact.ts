'use server'

import { cookies, headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { contactSchema } from '@/lib/validations/contact'
import { insertContact } from '@/lib/db/queries/contact'
import { sendNotification } from '@/lib/email'
import type { Variant } from '@/lib/variants/types'

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
        '1 h'
      ),
    })
  : null

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function submitContact(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const ip = (await headers()).get('x-real-ip') ?? '127.0.0.1'
  
  if (ratelimit) {
    const { success: rateLimitOk } = await ratelimit.limit(ip)
    if (!rateLimitOk) {
      return { success: false, error: 'しばらく時間をおいてから再送してください' }
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

  try {
    const contact = await insertContact({ ...parsed.data, variant, ipAddress: ip })
    void sendNotification(contact)
    return { success: true, id: contact.id }
  } catch (error) {
    console.error('Failed to insert contact:', error)
    return { success: false, error: '送信中にエラーが発生しました。時間をおいて再度お試しください。' }
  }
}
