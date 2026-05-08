# セキュリティ設計書

**バージョン**: 1.3  
**作成日**: 2026-05-08  
**更新日**: 2026-05-08  
**準拠基準**: OWASP Top 10 (2021) / 個人情報保護法 (APPI)

---

## 1. 脅威モデル

### 主な攻撃ベクター

| 脅威 | 影響 | 対策ステータス |
|---|---|---|
| スパム・大量投稿 | DB 肥大化、メール爆撃 | Honeypot + レート制限 (**Turnstile は Post-launch**) |
| SQLインジェクション | データ漏洩・破壊 | Drizzle ORM (Prepared Statements) |
| XSS | Cookie 窃取、フィッシング | CSP + 自動エスケープ |
| CSRF | 不正フォーム投稿 | Server Actions (自動対策) |
| 機密情報漏洩 | APIキー・DB接続文字列の露出 | 環境変数管理 |
| DoS / DDoS | サービス停止 | Vercel Edge + レート制限 |
| 不正アクセス (将来: 管理画面) | データ閲覧・改ざん | 認証 (NextAuth / Clerk) |

---

## 2. 対策詳細

### 2.1 入力バリデーション (A03: Injection)

**方針**: クライアント・サーバーの両方でバリデーションを行う。クライアント側はUX向上目的、サーバー側が信頼の源泉。

```typescript
// lib/validations/contact.ts - 共有 Zod スキーマ
// ⚠️ agreed は boolean で受け取る前提。
//    FormData のチェックボックスは 'on' | undefined を返すため、
//    Server Action 側で boolean に変換してから渡すこと。(→ actions/contact.ts 参照)
import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, '氏名を入力してください')
    .max(100, '100文字以内で入力してください')
    .trim(),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .max(255),
  subject: z
    .string()
    .min(1, '件名を入力してください')
    .max(200),
  body: z
    .string()
    .min(1, 'お問い合わせ内容を入力してください')
    .max(2000),
  agreed: z
    .boolean()
    .refine((v) => v === true, 'プライバシーポリシーに同意してください'),
})
```

**SQL インジェクション対策**: Drizzle ORM は全クエリを Prepared Statements として実行する。生 SQL (`sql` タグ) を使用する場合は必ずパラメータバインドを行うこと。

```typescript
// ❌ 禁止: 文字列結合
sql`SELECT * FROM users WHERE email = '${email}'`

// ✅ 正しい: パラメータバインド
sql`SELECT * FROM users WHERE email = ${email}`
```

### 2.2 CSRF 対策 (A01: Broken Access Control)

**Next.js 15 Server Actions** は以下の CSRF 対策を自動的に行う:
- `Origin` ヘッダーの検証
- `Referer` ヘッダーの検証

追加対策として Server Actions では `same-origin` ポリシーが強制される。API Routes を外部公開する場合は別途 CSRF トークン検証が必要。

### 2.3 Bot 対策

#### 初期リリース: Honeypot フィールド

外部依存なし・UX 影響ゼロのボット対策。フォームに不可視フィールドを追加し、値が入っていたら即棄却する。

```tsx
// components/forms/ContactForm.tsx
// Honeypot: CSSで非表示。本物のユーザーは入力しない
<input
  type="text"
  name="website"
  autoComplete="off"
  tabIndex={-1}
  aria-hidden="true"
  className="absolute opacity-0 pointer-events-none h-0 w-0"
/>
```

```typescript
// lib/actions/contact.ts - Honeypot チェック
const honeypot = formData.get('website')
if (honeypot) {
  // ボットには成功を返してサイレント棄却
  return { success: true, id: 'honeypot' }
}
```

#### Post-launch: Cloudflare Turnstile（スパム増加時に対応）

→ 詳細は `requirements.md` の Post-launch TODO を参照。

---

### 2.4 レート制限 (A07: Software and Data Integrity Failures)

フォーム投稿エンドポイントにレート制限を実装する。

```typescript
// lib/actions/contact.ts での実装パターン
import { headers } from 'next/headers'

// Vercel KV (Redis) または upstash/ratelimit を使用
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// RATE_LIMIT_MAX 環境変数から読み込む。未設定時は 10 をデフォルト値とする。
const maxRequests = Number(process.env.RATE_LIMIT_MAX ?? '10')

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(maxRequests, '1 h'),
  analytics: true,
})

export async function submitContact(...) {
  // x-real-ip は Vercel が付与する偽装不可のヘッダー。
  // x-forwarded-for は攻撃者がリクエストヘッダーに任意の値を付加して偽装できるため使用しない。
  const ip = (await headers()).get('x-real-ip') ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    void notifySlack(`⚠️ レート制限超過: IP=${ip} at ${new Date().toISOString()}`)
    return { success: false, error: 'しばらく時間をおいてから再送してください' }
  }
  // ...
}

// Slack 通知ヘルパー (lib/notifications.ts として切り出し推奨)
async function notifySlack(message: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  }).catch(() => {})  // 通知失敗はサービスに影響させない
}
```

> **依存パッケージ**: `@upstash/ratelimit` + `@upstash/redis` (Vercel KV でも可)  
> **無料枠注意**: Upstash Free は 10,000リクエスト/日  
> **環境変数**: `SLACK_WEBHOOK_URL`（Server only）を追加すること

### 2.5 セキュリティヘッダー (A05: Security Misconfiguration)

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Three.js 要件
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://*.neon.tech",
    ].join('; '),
  },
]

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

> **CSP と Three.js**: WebGL シェーダーのコンパイルに `'unsafe-eval'` が必要。  
> 本番環境でのさらなる強化は nonce ベース CSP を検討。

### 2.6 機密情報管理 (A02: Cryptographic Failures)

| ルール | 詳細 |
|---|---|
| 環境変数のみ | DB接続文字列・APIキーはコードに書かない |
| `NEXT_PUBLIC_` 禁止 | サーバー専用の値に `NEXT_PUBLIC_` プレフィックスを付けない |
| `.env.local` は gitignore | `.env.example` のみコミット |
| Vercel 環境変数 | 本番値は Vercel ダッシュボードで設定 |
| ログ出力禁止 | `console.log(email)` などの個人情報ログ禁止 |

### 2.7 個人情報保護

| 項目 | 方針 |
|---|---|
| IP アドレス保存 | レート制限・不正調査目的のみ、90日後に削除 |
| ログ保持期間 | Vercel ログは30日 (Pro プランで延長可) |
| プライバシーポリシー同意 | フォーム送信前に必須チェック |
| データ削除対応 | 問い合わせ者からの削除依頼に対応できるクエリを用意 |

```typescript
// lib/db/queries/contact.ts に追加
export async function deleteContactByEmail(email: string) {
  await db
    .delete(contactSubmissions)
    .where(eq(contactSubmissions.email, email))
}
```

### 2.8 依存関係の脆弱性管理 (A06: Vulnerable Components)

```bash
# 定期実行 (月次推奨)
pnpm audit

# 自動: GitHub Dependabot を有効化
# .github/dependabot.yml を設定
```

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    # security-updates は ignore ルールをバイパスする仕様のため、
    # セキュリティパッチがメジャーバージョンで提供されても Dependabot が PR を作成する。
    # このルールは通常の機能更新のメジャーバンプのみ抑制する。
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
    open-pull-requests-limit: 10
```

---

## 3. セキュリティチェックリスト

### デプロイ前チェック

**防御**
- [ ] 全フォームフィールドにサーバーサイドバリデーションが実装されている
- [ ] Honeypot フィールドが実装されている
- [ ] レート制限で `x-real-ip` を使用している（`x-forwarded-for` は不使用）
- [ ] DB クエリに生文字列結合がない (全て ORM / Prepared Statements)
- [ ] 環境変数に機密情報がコードにハードコードされていない
- [ ] `.env.local` が `.gitignore` に含まれている
- [ ] セキュリティヘッダーが設定されている (`next.config.ts`)
- [ ] エラーメッセージに内部情報 (スタックトレース、DB情報) が含まれていない
- [ ] `pnpm audit` で high/critical 脆弱性がない

**検知**
- [ ] レート制限ヒット時に Slack 通知が届くことを確認した
- [ ] `SLACK_WEBHOOK_URL` が Vercel 環境変数に設定されている

**対応準備**
- [ ] インシデント対応手順書 (security.md §4) をチームで一読した
- [ ] P1 発生時のエスカレーション先が決まっている

### 本番運用チェック (月次)

- [ ] Vercel の Security Headers が A 評価以上 (securityheaders.com で確認)
- [ ] Neon の接続が SSL/TLS を強制している (`sslmode=require`)
- [ ] Vercel ログに個人情報が出力されていない
- [ ] Dependabot アラートを確認・対処した
- [ ] `pnpm audit` を実行し結果を記録した

---

## 4. インシデント対応

### 4.1 重大度分類

| 重大度 | 定義 | 初動目標 | 代表例 |
|---|---|---|---|
| **P1 (Critical)** | サービス停止 / 個人情報漏洩の可能性 | 30分以内に対応開始 | DB侵害、APIキー漏洩+不正アクセス確認、APPI報告義務発生 |
| **P2 (High)** | セキュリティ機能の低下 / 大量スパム | 4時間以内に対応開始 | レート制限突破、フォーム大量不正投稿 |
| **P3 (Low)** | 単発の不審アクセス / 設定ミス | 翌営業日 | 単一IPのスパム、Dependabot アラート、軽微な設定漏れ |

### 4.2 エスカレーションフロー

```
[Slack アラート受信 / 異常検知]
        │
        ▼
[重大度判定 (P1/P2/P3)]
        │
        ├─ P1 ──▶ 30分以内: 担当者がトリアージ
        │              │
        │              ▼
        │         個人情報漏洩の疑い？
        │              │ Yes
        │              ▼
        │         72時間以内: 個人情報保護委員会へ報告 (APPI 第26条)
        │         + 法務・経営層へ即時連絡
        │
        ├─ P2 ──▶ 4時間以内: 担当者がトリアージ
        │
        └─ P3 ──▶ 翌営業日: 担当者が対応
```

### 4.3 シナリオ別手順

#### スパム大量送信 (P2)

1. Slack アラートで検知（レート制限ヒット通知）
2. Vercel Firewall で送信元 IP をブロック
3. Upstash でレート制限を一時強化（`RATE_LIMIT_MAX` 環境変数を下げて再デプロイ）
4. DB で `status = 'spam'` フラグ付け・一括削除
5. 継続する場合は Post-launch TODO の Turnstile 実装を前倒し

#### APIキー漏洩 (P1)

1. 該当サービス（Resend / Upstash）でキーを**即時ローテーション**
2. Vercel 環境変数を更新・再デプロイ
3. git 履歴に混入していた場合: `git filter-repo` で削除 + force push + 全ブランチ更新通知
4. 漏洩期間中のアクセスログを確認し、不正利用の有無を調査

#### 個人情報漏洩 (P1) — APPI 対応

フォームで収集している個人情報: **氏名・メールアドレス・IPアドレス**

**報告義務の判定（APPI 第26条）**

```
漏洩確認
  │
  ├─ 以下のいずれかに該当する場合 → 報告義務あり
  │   ・漏洩件数 1,000件以上
  │   ・要配慮個人情報（健康・信条等）を含む
  │   ・不正アクセスによる漏洩（件数問わず）
  │   ・財産的被害が生じるおそれがある場合
  │       ▼
  │   速報: 72時間以内に個人情報保護委員会へ報告
  │         https://www.ppc.go.jp/personalinfo/legal/leakAction/
  │   確報: 30日以内（不正アクセスの場合は60日以内）
  │         ※確報には: 漏洩経緯・影響範囲・再発防止策を記載
  │
  └─ 上記に該当しない場合
          ▼
      社内記録のみ（報告義務なし）

本人通知（報告義務の有無にかかわらず原則実施）:
  速報提出後、速やかに影響を受けた本人へ通知する。
  通知内容: 漏洩した情報の種類・漏洩期間・問い合わせ窓口
```

**対応共通手順:**
1. 被害範囲の特定（影響を受けた行数・期間を DB で確認）
2. 漏洩経路の閉鎖（API キー無効化・DB アクセス制限）
3. 法務・経営層へ即時連絡
4. 報告義務の要否を判定 → 必要な場合は速報を 72 時間以内に提出
5. 影響ユーザーへの通知メール送信
6. 再発防止策の実施と記録・確報提出

#### Neon / DB 障害 (P2)

1. Neon Status Page 確認 (https://neonstatus.com)
2. 障害が長引く場合: フォームに `maintenance` バナーを表示してユーザーへ通知
3. 復旧後: PITR（ポイントインタイムリカバリ）でデータ整合性を確認
4. 送信失敗分は Vercel ログから手動でリカバリを検討

### 4.4 復旧目標 (RTO / RPO)

| 項目 | 目標値 | 根拠 |
|---|---|---|
| RTO (目標復旧時間) | 4時間 | コーポレートHPのためビジネスクリティカルではない |
| RPO (目標復旧時点) | 24時間 | Neon Free プランの PITR 対応範囲に依存 |

**Neon PITR**: Free プランでは24時間のポイントインタイムリカバリが利用可能。  
有料プランへの移行でより長い保持期間を設定できる。

---

## 5. Post-launch セキュリティ TODO

| 優先度 | 項目 | 概要 |
|---|---|---|
| 高 (30日以内) | **構造化ログ + 外部転送** | セキュリティイベント（レート制限ヒット、バリデーション失敗）を JSON 形式で Axiom / Datadog 等へ転送。Vercel ログ 30日制限を回避しフォレンジック調査を可能にする。 |
| 高 (30日以内) | **Neon バックアップ方針の明文化** | PITR の保持期間確認・有料プランへの移行判断、定期スナップショットの取得手順を運用ドキュメント化する。 |
| 中 (90日以内) | **CSP nonce 化** | 現状 `'unsafe-eval'` を Three.js のため許可している。nonce ベース CSP への移行で XSS 時の被害範囲を限定する。担当: フロントエンド開発者。マイルストーン: v2.0 リリース時。 |
| 低 | **SBOM 整備** | `pnpm list --depth=0` 等で依存ライブラリのインベントリを作成し、サプライチェーンリスクの可視化を行う。 |
