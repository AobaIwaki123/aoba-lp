'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { submitContact, type ActionResult } from '@/lib/actions/contact'

const initialState: ActionResult = { success: true, id: '' }

export function ContactForm() {
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(submitContact, initialState)
  const idempotencyKey = useRef(typeof window !== 'undefined' ? crypto.randomUUID() : '')

  useEffect(() => {
    if (state.success && state.id) {
      router.push('/contact/success')
    }
  }, [state, router])

  return (
    <form
      action={formAction}
      className="space-y-6"
      noValidate
    >
      {!state.success && state.error && (
        <div role="alert" className="p-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" style={{ color: 'var(--color-text)' }}>
            お名前 <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="山田 太郎"
            aria-invalid={!state.success && !!state.errors?.name}
            aria-describedby={!state.success && state.errors?.name ? 'name-error' : undefined}
            className={!state.success && state.errors?.name ? 'border-red-500' : ''}
          />
          {!state.success && state.errors?.name && (
            <p id="name-error" className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: 'var(--color-text)' }}>
            メールアドレス <span aria-hidden="true" className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="taro@example.com"
            aria-invalid={!state.success && !!state.errors?.email}
            aria-describedby={!state.success && state.errors?.email ? 'email-error' : undefined}
            className={!state.success && state.errors?.email ? 'border-red-500' : ''}
          />
          {!state.success && state.errors?.email && (
            <p id="email-error" className="text-sm text-red-500">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" style={{ color: 'var(--color-text)' }}>
          件名 <span aria-hidden="true" className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="転職についての相談"
          aria-invalid={!state.success && !!state.errors?.subject}
          aria-describedby={!state.success && state.errors?.subject ? 'subject-error' : undefined}
          className={!state.success && state.errors?.subject ? 'border-red-500' : ''}
        />
        {!state.success && state.errors?.subject && (
          <p id="subject-error" className="text-sm text-red-500">{state.errors.subject[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" style={{ color: 'var(--color-text)' }}>
          お問い合わせ内容 <span aria-hidden="true" className="text-red-500">*</span>
        </Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={6}
          placeholder="お問い合わせ内容をご記入ください。"
          aria-invalid={!state.success && !!state.errors?.body}
          aria-describedby={!state.success && state.errors?.body ? 'body-error' : undefined}
          className={!state.success && state.errors?.body ? 'border-red-500' : ''}
        />
        {!state.success && state.errors?.body && (
          <p id="body-error" className="text-sm text-red-500">{state.errors.body[0]}</p>
        )}
      </div>

      {/* Honeypot — ボット対策 */}
      <input type="text" name="website" className="sr-only" tabIndex={-1} aria-hidden="true" />

      {/* Idempotency Key — 重複送信対策 */}
      <input type="hidden" name="idempotency_key" value={idempotencyKey.current} />

      <div className="flex items-start gap-3">
        <Checkbox
          id="agreed"
          name="agreed"
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          required
        />
        <Label
          htmlFor="agreed"
          className="text-sm leading-relaxed cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <a href="/privacy-policy" className="underline hover:opacity-80" style={{ color: 'var(--color-brand)' }}>
            プライバシーポリシー
          </a>
          に同意します
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-6 text-base font-semibold"
        style={{ background: 'var(--color-brand)' }}
      >
        {isPending ? '送信中...' : '送信する'}
      </Button>

      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        2〜3営業日以内にご連絡いたします
      </p>
    </form>
  )
}
