# 実装方針書

**バージョン**: 1.4  
**作成日**: 2026-05-08  
**更新日**: 2026-05-08

---

## 1. ディレクトリ構造（詳細）

```
hp-project/
├── public/
│   ├── fonts/                      # セルフホスティングフォント
│   ├── images/                     # 静的画像
│   └── favicon.ico
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # ルートレイアウト (フォント・メタデータ・Providers)
│   │   ├── globals.css             # Tailwind base styles
│   │   ├── error.tsx               # グローバルエラーバウンダリ
│   │   ├── not-found.tsx           # 404 ページ
│   │   │
│   │   ├── (marketing)/            # ルートグループ: 公開ページ
│   │   │   ├── layout.tsx          # Header / Footer を含むレイアウト
│   │   │   ├── page.tsx            # LP: /
│   │   │   ├── about/
│   │   │   │   └── page.tsx        # /about
│   │   │   ├── contact/
│   │   │   │   ├── page.tsx        # /contact
│   │   │   │   └── success/
│   │   │   │       └── page.tsx    # /contact/success
│   │   │   └── privacy-policy/
│   │   │       └── page.tsx        # /privacy-policy
│   │   │
│   │   ├── (dashboard)/            # ルートグループ: 管理画面 (将来)
│   │   │   └── .gitkeep
│   │   │
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts        # POST /api/contact (Webhook等に使用)
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui コンポーネント (npx shadcn add で生成)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                 # ページ共通レイアウト
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── sections/               # ページセクション
│   │   │   ├── hero/               # A/B テスト対応: Hero はバリアント別に実装
│   │   │   │   ├── HeroA.tsx       # Particle Network Hero
│   │   │   │   ├── HeroB.tsx       # Wireframe Hero
│   │   │   │   └── HeroC.tsx       # Floating Spheres Hero
│   │   │   ├── StatsSection.tsx
│   │   │   ├── LogoBarSection.tsx
│   │   │   ├── ServicesSection.tsx # タブ切替: 転職希望者 / 採用企業
│   │   │   ├── FullBleedPhotoSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── canvas/                 # Three.js / R3F (全て 'use client')
│   │   │   ├── Scene.tsx           # <Canvas> ラッパー (カメラ・ライト設定)
│   │   │   ├── ParticleNetwork.tsx # Concept A: ノードと線のネットワーク
│   │   │   ├── WireframeIcosahedron.tsx # Concept B: ワイヤーフレーム正二十面体
│   │   │   └── FloatingSpheres.tsx # Concept C: 浮遊する暖色の球体
│   │   │
│   │   └── forms/
│   │       ├── ContactForm.tsx     # お問い合わせフォーム ('use client')
│   │       └── fields/
│   │           ├── TextField.tsx
│   │           └── TextareaField.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Drizzle クライアント初期化
│   │   │   ├── schema.ts           # テーブル定義 (→ DB設計書参照)
│   │   │   └── queries/
│   │   │       └── contact.ts      # お問い合わせ CRUD
│   │   │
│   │   ├── variants/
│   │   │   ├── types.ts            # Variant = 'A' | 'B' | 'C'
│   │   │   └── config.ts           # バリアント別機能フラグ (show3D, font 等)
│   │   │
│   │   ├── validations/
│   │   │   └── contact.ts          # Zod スキーマ (クライアント・サーバー共有)
│   │   │
│   │   ├── actions/
│   │   │   └── contact.ts          # Server Actions
│   │   │
│   │   ├── email/
│   │   │   ├── index.ts            # Resend クライアント
│   │   │   └── templates/
│   │   │       ├── admin-notification.tsx   # React Email テンプレート
│   │   │       └── auto-reply.tsx
│   │   │
│   │   └── utils.ts                # cn() 等ユーティリティ
│   │
│   └── types/
│       ├── index.ts                # 共通型定義
│       └── database.ts             # DB 行の型 (Drizzle InferSelect)
│
├── drizzle/
│   └── migrations/                 # Drizzle マイグレーションファイル (自動生成)
│
├── middleware.ts                    # A/B テスト バリアント Cookie 割り当て
├── .env.example                    # 環境変数テンプレート
├── .env.local                      # ローカル環境変数 (gitignore)
├── drizzle.config.ts               # Drizzle Kit 設定
├── next.config.ts                  # Next.js 設定
├── tailwind.config.ts              # Tailwind 設定
├── tsconfig.json                   # TypeScript 設定
├── eslint.config.mjs               # ESLint 設定
└── package.json
```

---

## 2. 実装順序

### Phase 0: 外部サービスセットアップ（Phase 1 着手前に完了）

> ⚠️ **Resend のドメイン認証 (DNS) は最大 24時間かかる。最初に着手すること。**

```
1. [ ] Resend ← 最初にやる（DNS 反映待ちがあるため）
       - アカウント作成 → ドメイン追加 → DNS TXT / MX レコードを DNS に設定
       - API キー取得 → .env.local に記載
       - 所要時間: 設定5分 + DNS 反映待ち 数時間〜24時間

2. [ ] Neon
       - アカウント作成 → プロジェクト作成 (リージョン: ap-southeast-1 推奨)
       - DATABASE_URL (pooler), DATABASE_URL_UNPOOLED (direct) を取得
       - 所要時間: 10分

3. [ ] Upstash
       - アカウント作成 → Redis データベース作成 (リージョン: ap-northeast-1 推奨)
       - UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN を取得
       - 所要時間: 10分

4. [ ] Slack
       - 通知用チャンネル作成 (#hp-alerts 等)
       - Incoming Webhook URL 取得 → SLACK_WEBHOOK_URL に設定
       - 所要時間: 5分

5. [ ] Vercel
       - アカウント作成 → GitHub リポジトリと連携
       - Environment Variables に .env.example の全項目を設定
         (Preview / Production の両環境)
       - 所要時間: 15分

6. [ ] .env.local に全環境変数を記入して動作確認
```

### Phase 1: 基盤セットアップ（環境構築）

```
1. [ ] Next.js 15 プロジェクト作成 (create-next-app)
2. [ ] TypeScript strict mode 設定
3. [ ] Tailwind CSS v4 設定

   ⚠️ 互換性確認 — shadcn/ui + Tailwind v4:
   4. [ ] npx shadcn@latest init 実行
   5. [ ] Button コンポーネントを追加 (npx shadcn@latest add button)
   6. [ ] ブラウザで表示してスタイルが正しく当たることを確認
          問題がある場合: https://ui.shadcn.com/docs/installation/next を参照

7. [ ] ESLint / Prettier 設定
8. [ ] 環境変数ファイル (.env.example) 確認・.env.local 設定
9. [ ] Drizzle ORM + Neon セットアップ
10.[ ] DB マイグレーション実行
11.[ ] updated_at トリガーを Neon SQL Editor で手動実行 (→ database.md §5b)

   ⚠️ 互換性確認 — React 19 + @react-three/fiber:
   12.[ ] pnpm add three @react-three/fiber @react-three/drei を実行
   13.[ ] 簡単な <Canvas><mesh><boxGeometry /></mesh></Canvas> で描画確認
          NG の場合: @react-three/fiber@^9.0.0-rc.x (React 19 対応 RC) を試す
          または react を 18 系に下げることも選択肢
```

### Phase 2: レイアウト・共通コンポーネント

```
1. [ ] app/layout.tsx (フォント・メタデータ)
2. [ ] Header / Navigation コンポーネント
3. [ ] Footer コンポーネント
4. [ ] (marketing)/layout.tsx
5. [ ] globals.css + デザイントークン定義
```

### Phase 3: ページ実装

```
1. [x] globals.css にバリアント別 CSS カスタムプロパティ定義 (design.md §3〜§5 参照)
2. [x] middleware.ts — バリアント Cookie 割り当て実装
3. [x] lib/variants/types.ts, config.ts
4. [x] LP (/) — 共通セクション (Stats / Services / HowItWorks / Testimonials / CTA)
       コンセプト A のデザイントークンで実装し、後から B/C を追加
5. [x] Hero — HeroA.tsx (3D なし、モックコピーのみ)
6. [x] /about
7. [x] /privacy-policy (静的)
8. [x] /contact — フォームUI (送信機能なし)
```

> **コンテンツ**: design.md §2 のモックコピーを使用。本番コンテンツは別途差し替え。

### Phase 4: フォーム機能

```
1. [x] Zod スキーマ定義 (lib/validations/contact.ts)
2. [x] Server Action 実装 (lib/actions/contact.ts)
3. [x] DB 書き込みクエリ (lib/db/queries/contact.ts)
4. [x] フォームとServer Actionの接続
5. [x] Honeypot フィールド追加 (不可視、ボット対策)
6. [x] エラーハンドリング・インラインエラー表示
7. [x] /contact/success サンクスページ実装
8. [x] メール通知 (Resend)
```

### Phase 5: Three.js 演出 + A/B バリアント完成

```
1. [x] @react-three/fiber セットアップ
2. [x] Scene.tsx (Canvas + カメラ + ライト、バリアント共通ラッパー)
3. [x] ParticleNetwork.tsx (Concept A)
4. [x] WireframeIcosahedron.tsx (Concept B)
5. [x] FloatingSpheres.tsx (Concept C)
6. [x] HeroB.tsx, HeroC.tsx の実装 (HeroA.tsx に続いて)
7. [x] next/dynamic で全 Canvas を遅延読み込み
8. [x] モバイル判定 (useMediaQuery) で WebGL 無効化 + 代替表示
9. [x] Framer Motion スクロール連動 (whileInView)
10.[x] ?__variant=A|B|C で強制切り替え確認
```

### Phase 6: 品質・本番対応

```
1. [ ] メタデータ・OGP 設定 (求人サービス用タイトル・description)
2. [ ] Lighthouse スコア確認・改善
3. [ ] レート制限実装 (Upstash Redis + x-real-ip)
4. [ ] Slack アラート動作確認 (SLACK_WEBHOOK_URL を Vercel に設定)
5. [ ] インシデント対応手順書 (security.md §4) をチームで確認
6. [ ] E2E テスト (Playwright)
7. [ ] Vercel 本番デプロイ
8. [ ] カスタムドメイン設定
9. [ ] securityheaders.com でヘッダー評価確認 (A 評価以上を確認)
```

---

## Post-launch TODO（リリース後の既知課題）

```
1. [ ] 構造化ログ + 外部ログ転送 (30日以内)
       - セキュリティイベントを JSON 形式で出力: { event, ip, timestamp, ... }
       - Axiom / Datadog 等の外部サービスへ転送し 30日超のログ保持を実現
       - 対象ファイル: lib/logger.ts (新規作成)

2. [ ] Neon バックアップ方針の明文化 (30日以内)
       - Free プランの PITR 範囲 (24h) を確認
       - 有料プランへの移行トリガーを定義 (問い合わせ件数 or データ量の閾値)
       - 対象: docs/runbook.md に運用手順を追記

3. [ ] Cloudflare Turnstile 実装 (スパム増加時)
       - 追加パッケージ: なし (fetch で Turnstile API を直接コール)
       - 追加環境変数: TURNSTILE_SECRET_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY
       - 対象ファイル: ContactForm.tsx, lib/actions/contact.ts

4. [ ] データ保持ポリシー適用 Cron (中期) ← database.md §7 の保持期間を実装する
       - Vercel Cron Jobs で毎日 0:00 JST に実行
       - 対象ファイル: app/api/cron/data-cleanup/route.ts (新規作成)
       - 処理内容（1ジョブにまとめて実行）:
         a. ip_address の NULL 化:
            UPDATE contact_submissions SET ip_address = NULL
              WHERE created_at < NOW() - INTERVAL '90 days'
              AND ip_address IS NOT NULL
         b. spam レコードの物理削除:
            DELETE FROM contact_submissions
              WHERE status = 'spam'
              AND created_at < NOW() - INTERVAL '30 days'
         c. ソフトデリート済みレコードの物理削除:
            DELETE FROM contact_submissions
              WHERE deleted_at IS NOT NULL
              AND deleted_at < NOW() - INTERVAL '90 days'
         d. 3年超レコードのソフトデリート:
            UPDATE contact_submissions SET deleted_at = NOW()
              WHERE updated_at < NOW() - INTERVAL '3 years'
              AND deleted_at IS NULL

5. [ ] CSP nonce 化 (90日以内)
       - `unsafe-eval` の Three.js 依存を解消しつつ nonce ベース CSP に移行
       - 対象ファイル: next.config.ts, app/layout.tsx

6. [ ] メール送信失敗アラート (低優先)
       - Resend の送信失敗を try/catch で捕捉し Slack Webhook へ通知
       - 対象ファイル: lib/email/index.ts

7. [ ] SBOM 整備 (低優先)
       - `pnpm list --depth=0` でインベントリ生成・定期更新
```

---

## 3. コーディング規約

### 3.1 TypeScript

```typescript
// ✅ 型は明示的に定義する
type ContactFormValues = {
  name: string
  email: string
  subject: string
  body: string
  agreed: boolean
}

// ✅ Server Action の戻り値型を定義する
type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

// ❌ any は禁止
const data: any = ...
```

### 3.2 コンポーネント

```typescript
// ✅ Props 型は同ファイルに定義
type HeroSectionProps = {
  headline: string
  subheadline: string
}

export function HeroSection({ headline, subheadline }: HeroSectionProps) {
  ...
}

// ✅ Server Component がデフォルト。必要な場合のみ 'use client'
// ❌ 不必要な 'use client' 追加禁止
```

### 3.3 ファイル命名

| 種類 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `HeroSection.tsx` |
| ユーティリティ / lib | camelCase | `contact.ts` |
| Next.js 規約ファイル | lowercase | `page.tsx`, `layout.tsx` |
| 型定義 | camelCase | `database.ts` |

### 3.4 インポート順序

```typescript
// 1. React / Next.js
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// 2. 外部ライブラリ
import { useForm } from 'react-hook-form'

// 3. 内部 (@ エイリアス)
import { Button } from '@/components/ui/button'
import { submitContact } from '@/lib/actions/contact'

// 4. 型
import type { ContactFormValues } from '@/types'
```

### 3.5 Tailwind CSS

```tsx
// ✅ cn() ユーティリティを使用 (clsx + tailwind-merge)
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', className)} />

// ❌ インラインスタイルは使用しない (Three.js の Canvas サイズ指定は例外)
```

---

## 4. Server Action パターン

```typescript
// lib/actions/contact.ts
'use server'

import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import { contactSchema } from '@/lib/validations/contact'
import { insertContact } from '@/lib/db/queries/contact'
import { sendNotification } from '@/lib/email'
import type { Variant } from '@/lib/variants/types'

export async function submitContact(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // 1. レート制限
  const ip = (await headers()).get('x-real-ip') ?? '127.0.0.1'
  const { success: rateLimitOk } = await ratelimit.limit(ip)
  if (!rateLimitOk) {
    void notifySlack(`⚠️ レート制限超過: IP=${ip}`)
    return { success: false, error: 'しばらく時間をおいてから再送してください' }
  }

  // 2. Honeypot チェック (ボットは非表示フィールドに値を入れる)
  if (formData.get('website')) {
    return { success: true, id: 'honeypot' }
  }

  // 3. FormData → plain object 変換 + バリデーション
  // ⚠️ FormData のチェックボックスは 'on' | undefined を返す。boolean に変換が必要。
  const rawData = Object.fromEntries(formData)
  const parsed = contactSchema.safeParse({
    ...rawData,
    agreed: rawData.agreed === 'on',
  })
  if (!parsed.success) {
    return { success: false, error: '入力内容を確認してください' }
  }

  // 4. A/B テストバリアント取得
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant

  // 5. DB 保存
  const contact = await insertContact({ ...parsed.data, variant, ipAddress: ip })

  // 6. メール通知 (非同期・失敗しても成功扱い)
  void sendNotification(contact)

  return { success: true, id: contact.id }
}
```

---

## 5. Three.js 実装パターン

```tsx
// app/(marketing)/page.tsx (RSC)
import dynamic from 'next/dynamic'
import { HeroContent } from '@/components/sections/HeroSection'

const HeroCanvas = dynamic(
  () => import('@/components/canvas/Scene').then((m) => m.HeroCanvas),
  { ssr: false }
)

export default function Page() {
  return (
    <section className="relative h-screen">
      {/* Canvas は背景レイヤー */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="bg-background h-full" />}>
          <HeroCanvas />
        </Suspense>
      </div>
      {/* テキストコンテンツは前面 */}
      <div className="relative z-10">
        <HeroContent />
      </div>
    </section>
  )
}
```

---

## 6. 環境変数管理

`.env.example` をコードベースに含め、`.env.local` は gitignore する。

```bash
# .env.example

# Neon Database (pooler URL for runtime)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Neon Database (direct URL for migrations)
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=admin@example.com

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
RATE_LIMIT_MAX=10

# Slack (インシデントアラート)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz

# Cloudflare Turnstile (Post-launch TODO)
# TURNSTILE_SECRET_KEY=0x...
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...

# App
NEXT_PUBLIC_SITE_URL=https://example.com
```

---

## 7. 依存パッケージ一覧

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@neondatabase/serverless": "^0.10.0",
    "drizzle-orm": "^0.38.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.115.0",
    "framer-motion": "^11.0.0",
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.28",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.29.0",
    "@types/three": "^0.170.0",
    "typescript": "^5.7.0",
    "vitest": "^2.0.0",
    "@playwright/test": "^1.49.0"
  }
}
```

> ⚠️ **@react-three/fiber**: v8 は React 18 向けに作られている。Phase 1 の互換性確認で NG の場合は  
> `"@react-three/fiber": "^9.0.0-rc.x"` に変更する（React 19 対応 RC）。

---

## 8. メールテンプレート仕様

### 8.1 管理者通知メール (`admin-notification.tsx`)

| 項目 | 内容 |
|---|---|
| 件名 | `[求人サービス] 新規お問い合わせ: {件名}` |
| 送信元 | `noreply@{送信ドメイン}` |
| 送信先 | `CONTACT_EMAIL` 環境変数 |

**本文に含める情報**:
- 受信日時
- 氏名 / メールアドレス / 件名 / 本文
- A/B テストバリアント
- 「管理画面で確認」ボタン（将来の管理画面 URL）

### 8.2 自動返信メール (`auto-reply.tsx`)

| 項目 | 内容 |
|---|---|
| 件名 | `お問い合わせを受け付けました` |
| 送信元 | `noreply@{送信ドメイン}` |
| 送信先 | 投稿者のメールアドレス |

**本文テンプレート** (モック文言):
```
{氏名} 様

この度はお問い合わせいただきありがとうございます。
以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━
件名: {件名}
お問い合わせ内容:
{本文}
━━━━━━━━━━━━━━━

2〜3営業日以内に担当者よりご連絡いたします。
しばらくお待ちください。

──────────────────
求人サービス名（モック）
support@example.com
https://example.com
```

---

## 9. ページコンテンツ仕様

### 9.1 /contact/success（サンクスページ）

```
見出し:   送信が完了しました
本文:     お問い合わせありがとうございます。
          2〜3営業日以内に担当者よりご連絡いたします。
CTA:      トップページに戻る  →  href="/"
補足:     送信内容の確認メールをご登録のアドレスに送信しました。
```

### 9.2 error.tsx（グローバルエラーページ）

```
見出し:   エラーが発生しました
本文:     申し訳ありません。しばらく時間をおいて再度お試しください。
          問題が続く場合はお問い合わせください。
CTA1:     もう一度試す   →  error.reset() を呼び出す
CTA2:     ホームに戻る   →  href="/"
```

### 9.3 not-found.tsx（404 ページ）

```
見出し:   ページが見つかりません
本文:     お探しのページは移動または削除された可能性があります。
CTA:      ホームに戻る   →  href="/"
```

### 9.4 /about（モックコンテンツ）

```
セクション1 — Mission
  見出し: 「はたらく人の、可能性を広げる。」
  本文:   求人マッチングの民主化をミッションに、
          テクノロジーと人の力で最適な出会いを創出します。

セクション2 — 会社概要（モック）
  会社名:   株式会社ジョビファイ（モック）
  設立:     2020年4月
  所在地:   東京都渋谷区
  事業内容: 求人情報サービス / キャリア支援

セクション3 — チーム（モック、3名分のプレースホルダー）
  - 代表取締役 山田 太郎（モック）
  - CTO 鈴木 花子（モック）
  - VP of Sales 田中 一郎（モック）
  ※ 写真: public/images/team/ にプレースホルダー画像を配置
```

### 9.5 /privacy-policy（必須記載事項）

> ⚠️ **リリース前に法務担当と最終確認すること。** 以下は APPI（個人情報保護法）および電気通信事業法（外部送信規律）に基づく必須構成。モック文言の箇所は本番前に差し替える。

**1. 個人情報取扱事業者**

| 項目 | 内容 |
|---|---|
| 名称 | 株式会社〇〇（本番時に差し替え） |
| 住所 | 〇〇都〇〇区（本番時に差し替え） |
| 代表者 | 代表取締役 〇〇 〇〇（本番時に差し替え） |
| 問い合わせ窓口 | privacy@example.com（本番時に差し替え） |

**2. 利用目的**
- お問い合わせへの対応および回答
- サービス品質改善のための統計分析（個人を特定しない形で利用）

**3. 第三者提供・業務委託先（外部送信規律 含む）**

| 委託先 | 送信する情報 | 目的 | プライバシーポリシー |
|---|---|---|---|
| Neon (Postgres) | 氏名・メール・お問い合わせ内容・IP | データ保管 | neon.tech/privacy |
| Resend | 氏名・メールアドレス | メール送信 | resend.com/legal/privacy-policy |
| Upstash (Redis) | IPアドレス | スパム・不正送信防止（レート制限） | upstash.com/trust/privacy.pdf |
| Vercel | アクセスログ（IP含む） | ホスティング・CDN | vercel.com/legal/privacy-policy |

> これらは利用目的の達成に必要な範囲での業務委託であり、第三者提供には該当しない。

**4. Cookie（外部送信規律）**

| Cookie 名 | 保持期間 | 目的 |
|---|---|---|
| `variant` | 30日 | A/Bテスト（デザインバリアント割り当て） |

**5. 保持期間**（→ `database.md §7` と整合）

| データ | 保持期間 |
|---|---|
| お問い合わせ内容・氏名・メール | 最終更新から3年 |
| IPアドレス | 収集から90日後にNULL化 |
| スパム判定レコード | 判定から30日後に削除 |

**6. 開示・訂正・利用停止等の請求**

上記 5 の問い合わせ窓口へメールにてご連絡ください。本人確認書類の提出をお願いする場合があります。

---

### 9.6 /terms（利用規約）— 要否の検討

`requirements.md §7` 項目5 を参照。法務確認の結果、必要と判断された場合は `/terms` ページを追加し、お問い合わせフォームのチェックボックスにリンクを加える。

---

## 10. CI ワークフロー

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Test
        run: pnpm test --run

      - name: Build
        run: pnpm build
        env:
          # ビルド時に必要な環境変数（シークレット不要のダミー値）
          DATABASE_URL: postgresql://dummy:dummy@localhost/dummy
          NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

> **package.json に追加するスクリプト**:
> ```json
> "scripts": {
>   "dev": "next dev",
>   "build": "next build",
>   "start": "next start",
>   "lint": "next lint",
>   "test": "vitest",
>   "test:e2e": "playwright test",
>   "db:generate": "drizzle-kit generate",
>   "db:migrate": "drizzle-kit migrate"
> }
> ```
