'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export function ContactForm() {
  const [agreed, setAgreed] = useState(false)

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
      noValidate
    >
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
          />
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
          />
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
        />
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
        />
      </div>

      {/* Honeypot — ボット対策 */}
      <input type="text" name="website" className="sr-only" tabIndex={-1} aria-hidden="true" />

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
        disabled={!agreed}
        className="w-full py-6 text-base font-semibold"
        style={{ background: 'var(--color-brand)' }}
      >
        送信する
      </Button>

      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        2〜3営業日以内にご連絡いたします
      </p>
    </form>
  )
}
