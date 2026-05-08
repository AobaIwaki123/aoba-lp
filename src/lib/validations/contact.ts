import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください').max(100, 'お名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください').max(255),
  subject: z.string().min(1, '件名を入力してください').max(200, '件名は200文字以内で入力してください'),
  body: z.string().min(1, 'お問い合わせ内容を入力してください').max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
  agreed: z.boolean().refine((val) => val === true, {
    message: 'プライバシーポリシーに同意する必要があります',
  }),
})

export type ContactFormValues = z.infer<typeof contactSchema>
