# アーキテクチャ設計書

**バージョン**: 1.1  
**作成日**: 2026-05-08  
**更新日**: 2026-05-08

---

## 1. システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│                                                             │
│   React (RSC + Client Components)                           │
│   ├── Three.js Canvas (WebGL)                               │
│   ├── Framer Motion (Animations)                            │
│   └── shadcn/ui Components                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Next.js 15 (App Router)                │   │
│   │                                                     │   │
│   │  ┌──────────────────┐  ┌────────────────────────┐  │   │
│   │  │  React Server    │  │   Server Actions        │  │   │
│   │  │  Components      │  │   (Form Submit)         │  │   │
│   │  │  (SSR / SSG)     │  │                         │  │   │
│   │  └──────────────────┘  └────────────┬───────────┘  │   │
│   │                                     │               │   │
│   │  ┌──────────────────────────────────▼───────────┐  │   │
│   │  │           API Routes (/api/*)                 │  │   │
│   │  │   - POST /api/contact  (Rate limited)         │  │   │
│   │  └──────────────────────────────────┬───────────┘  │   │
│   └─────────────────────────────────────┼───────────────┘   │
└─────────────────────────────────────────┼───────────────────┘
                                          │ Neon Serverless Driver
┌─────────────────────────────────────────▼───────────────────┐
│                    NEON (Serverless Postgres)                 │
│                                                             │
│   contact_submissions  users  (future tables...)            │
└─────────────────────────────────────────────────────────────┘

                                          │ SMTP / API
┌─────────────────────────────────────────▼───────────────────┐
│                    RESEND (Email)                            │
│   - 管理者通知メール                                         │
│   - 自動返信メール                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              UPSTASH REDIS (Rate Limiting)                   │
│   - フォーム投稿: 10回/時/IP のスライディングウィンドウ      │
│   - 無料枠: 10,000 req/日                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. レンダリング戦略

| ページ | 戦略 | 理由 |
|---|---|---|
| `/` (LP) | SSG (Static) | 更新頻度低、最速表示 |
| `/about` | SSG (Static) | 同上 |
| `/contact` | SSG + Client | フォームはクライアント、静的シェル |
| `/api/contact` | Serverless Function | DB書き込みが必要 |

> **原則**: データ取得は RSC で行い、インタラクションが必要な箇所のみ `'use client'` を付与する。

---

## 3. コンポーネント設計

### 3.1 階層構造

```
app/
└── (marketing)/
    └── page.tsx                    # [RSC] ページ組み立て
        └── HeroSection             # [RSC] レイアウト
            ├── HeroCanvas          # [Client] Three.js
            └── HeroContent         # [RSC] テキスト + CTA

components/
├── ui/                             # shadcn/ui (Atomic)
│   ├── button.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── ...
├── sections/                       # ページセクション (Molecular)
│   ├── HeroSection.tsx
│   ├── ServicesSection.tsx
│   ├── AboutSection.tsx
│   └── ContactSection.tsx
├── canvas/                         # Three.js (Client only)
│   ├── Scene.tsx                   # R3F Canvas ラッパー
│   ├── ParticleField.tsx
│   └── FloatingGeometry.tsx
└── forms/                          # フォーム (Molecular)
    ├── ContactForm.tsx
    └── fields/
        ├── TextField.tsx
        └── TextareaField.tsx
```

### 3.2 コンポーネント分類ルール

| 分類 | ディレクトリ | 'use client' | 責任 |
|---|---|---|---|
| UI Primitive | `components/ui/` | なし (shadcn/ui に従う) | スタイル・アクセシビリティ |
| Section | `components/sections/` | 原則なし | レイアウト・コンテンツ配置 |
| Canvas | `components/canvas/` | 必須 | Three.js レンダリング |
| Form | `components/forms/` | 必須 | インタラクション・バリデーション |

---

## 4. データフロー

### 4.1 フォーム投稿フロー

```
[User Input]
     │
     ▼
[ContactForm.tsx]  ← React Hook Form + Zod (クライアントバリデーション)
     │
     │ Server Action: submitContact(formData)
     ▼
[lib/validations/contact.ts]  ← Zod サーバーサイド再バリデーション
     │
     │ バリデーション失敗 → エラーレスポンス → フォームに表示
     │ バリデーション成功 ↓
     ▼
[lib/db/queries/contact.ts]  ← Drizzle INSERT
     │
     ▼
[Neon Postgres: contact_submissions]
     │
     │ 非同期
     ▼
[Resend API]  ← 管理者通知 + 自動返信
     │
     ▼
[router.push('/contact/success')]  ← サンクスページへリダイレクト
```

### 4.2 ページデータ取得フロー（将来: CMS連携）

```
[RSC page.tsx]
     │
     │ fetch() with next: { revalidate: 3600 }
     ▼
[CMS API / Static JSON]
     │
     ▼
[Section Components]  ← Props として渡す
```

---

## 5. 環境変数設計

| 変数名 | 用途 | スコープ |
|---|---|---|
| `DATABASE_URL` | Neon 接続文字列 (pooler) | Server only |
| `DATABASE_URL_UNPOOLED` | Neon 直接接続 (マイグレーション用) | Server only |
| `RESEND_API_KEY` | メール送信 | Server only |
| `CONTACT_EMAIL` | 管理者通知先メール | Server only |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis エンドポイント (レート制限) | Server only |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis 認証トークン | Server only |
| `SLACK_WEBHOOK_URL` | レート制限超過・障害時のアラート通知先 | Server only |
| `NEXT_PUBLIC_SITE_URL` | サイトURL (OGP等) | Public |
| `RATE_LIMIT_MAX` | レート制限上限 (デフォルト: 10) | Server only |

> `NEXT_PUBLIC_` プレフィックスのない変数はブラウザに露出しない。  
> Vercel の Environment Variables に設定し、コードにハードコードしない。

---

## 6. エラーハンドリング方針

| レイヤー | 処理 |
|---|---|
| Zod バリデーション失敗 | フォームフィールドにインラインエラー表示 |
| Server Action 失敗 | `{ success: false, error: string }` を返却、トーストで通知 |
| DB 接続エラー | 503 レスポンス + エラーページ表示 |
| 未捕捉エラー | `app/error.tsx` がキャッチ、ユーザーフレンドリーなエラー画面 |
| 404 | `app/not-found.tsx` |
| メール送信失敗 | `void sendNotification()` は失敗しても投稿成功扱い。失敗は Vercel ログに記録。Post-launch で Slack アラート整備。|

---

## 7. CI/CD パイプライン

```
git push → GitHub Actions
               │
               ├── lint (ESLint + Prettier check)
               ├── type-check (tsc --noEmit)
               ├── test (Vitest)
               └── build (next build)
                        │
                        ▼ (main branch only)
               Vercel Deploy
               ├── Preview Deploy (PR)
               └── Production Deploy (main)
```

---

## 8. 技術的決定事項 (ADR)

### ADR-001: Server Actions vs API Routes

**決定**: フォーム投稿は Server Actions を使用  
**理由**: Next.js 15 での推奨パターン、CSRF トークン自動管理、プログレッシブエンハンスメント対応  
**例外**: Webhook 受信など外部からの POST は API Routes を使用

### ADR-002: Drizzle ORM vs Prisma

**決定**: Drizzle ORM を採用  
**理由**: Neon Serverless Driver との統合が良好、バンドルサイズ小、SQL-likeで可読性高い  
**トレードオフ**: Prisma の方が自動補完・スキーマ管理が充実しているが、Edge 非対応の懸念あり

### ADR-003: Three.js の遅延読み込み

**決定**: `next/dynamic` + `{ ssr: false }` で全 Canvas コンポーネントを読み込む  
**理由**: WebGL は SSR 不可、LCP への影響を排除するため  
**実装**: `<Suspense fallback={<StaticHero />}>` でフォールバック表示

### ADR-004: メール送信サービス — Resend vs 競合

**決定**: Resend を採用

**比較検討した選択肢**:

| 選択肢 | 採用しなかった理由 |
|---|---|
| SendGrid | 大規模向けで設定・管理画面が複雑。このプロジェクトの用途（2種類のトランザクションメール）には過剰 |
| Mailgun | API は柔軟だが、React テンプレートとの統合が非公式。ドキュメントが SendGrid・Resend より整備されていない |
| AWS SES | 単価最安だが、サンドボックス解除の申請手続き・IAM 設定・AWS アカウント管理コストが高い。Vercel + Neon のスタックと文脈が合わない |
| Nodemailer (SMTP) | Vercel Serverless Functions は SMTP 永続接続を維持できない。コネクションタイムアウトが頻発するため非推奨 |

**Resend を選んだ理由**:
1. **React Email との統合** — `@react-email/components` で JSX としてテンプレートを書ける。TypeScript の型補完が効き、デザインのプレビューも可能
2. **Next.js / Vercel との公式連携** — Vercel の公式ドキュメントで推奨されており、Server Actions からの呼び出しパターンが整備されている
3. **セットアップコストが低い** — DNS 認証（TXT + MX レコード設定）のみ。SES のようなサンドボックス解除申請が不要
4. **無料枠が MVP に十分** — 3,000通/月。このプロジェクトのメール量（問い合わせ1件につき管理者通知＋自動返信の2通）では 1,500件/月まで無料枠内

**トレードオフ**: 月 3,000 通を超えると有料プラン（$20/月〜）が必要。大量送信（メルマガ等）に将来拡張する場合は SendGrid / Mailgun への移行を検討する。
