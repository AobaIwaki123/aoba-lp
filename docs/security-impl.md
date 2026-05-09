# セキュリティ実装ガイド

このドキュメントは「実際のコードが何をしているか」を実装ファイルと対応させながら説明します。
設計の背景・脅威モデル・インシデント対応は [`security.md`](security.md) を参照してください。

---

## 1. 入力バリデーション（Zod）

**ファイル**: `src/lib/validations/contact.ts`、`src/lib/actions/contact.ts`

```
ユーザーがフォームを送信
  ↓
クライアント側: React Hook Form + contactSchema でリアルタイム検証（UX向上目的）
  ↓
サーバー側: Server Action 内で contactSchema.safeParse() を再検証（これが信頼の源泉）
  ↓
失敗 → エラーをフォームに返す
成功 → 次の処理へ
```

**何をしているか**: フォームの各フィールドに長さ・形式の制約をかけています。クライアント側の検証はブラウザ上で行われるため JS を無効化するとスキップできますが、サーバー側（Server Action）での検証はスキップできないため、こちらが実際の防衛ラインです。

```typescript
// src/lib/validations/contact.ts（実際のコード）
export const contactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email().max(255),
  subject: z.string().min(1).max(200),
  body:    z.string().min(1).max(2000),
  agreed:  z.boolean().refine((v) => v === true),
})
```

> **注意点**: FormData のチェックボックスは `'on'` という文字列で来ます。`agreed` フィールドの boolean 変換は Server Action 側で行っています（`rawData.agreed === 'on'`）。

---

## 2. SQL インジェクション対策（Drizzle ORM）

**ファイル**: `src/lib/db/queries/contact.ts`

**何をしているか**: Drizzle ORM を使うと、クエリは必ずパラメータ化クエリ（Prepared Statement）として実行されます。これにより、ユーザー入力が SQL コマンドとして解釈される余地がありません。

```typescript
// src/lib/db/queries/contact.ts（実際のコード）
const [inserted] = await db
  .insert(contactSubmissions)
  .values(normalizedData)   // ← 値は自動的にパラメータとしてバインドされる
  .returning()
```

**やってはいけないこと**: `sql` タグを使って文字列結合するとこの保護が無効になります。

```typescript
// ❌ 危険（文字列結合）
sql`SELECT * FROM contact_submissions WHERE email = '${email}'`

// ✅ 安全（パラメータバインド）
sql`SELECT * FROM contact_submissions WHERE email = ${email}`
```

---

## 3. レート制限（Upstash Redis）

**ファイル**: `src/lib/actions/contact.ts`

```
フォーム送信リクエスト
  ↓
IP アドレス取得（x-real-ip ヘッダー）
  ↓
Upstash Redis に問い合わせ:「この IP は過去1時間に何回送信しているか?」
  ↓
10回以上 → エラーを返す + Slack 通知
10回未満 → 処理を続行、カウントをインクリメント
```

**何をしているか**: 同じ IP から短時間に大量のフォーム送信が来た場合に弾きます。スライディングウィンドウ方式なので「1時間以内に10回」という制限が常に直近1時間を基準に計算されます（固定時間帯リセット方式よりスパムに抜けられにくい）。

```typescript
// src/lib/actions/contact.ts（実際のコード、抜粋）
const ratelimit = redisUrl && redisToken && process.env.NODE_ENV !== 'development'
  ? new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.RATE_LIMIT_MAX || '10', 10),
        '1 h'
      ),
    })
  : null  // ← 開発環境・E2Eテスト時は Redis なしで動く

const ip = (await headers()).get('x-real-ip') ?? '127.0.0.1'

if (ratelimit) {
  const { success: rateLimitOk } = await ratelimit.limit(ip)
  if (!rateLimitOk) {
    after(() => notifySlack(`⚠️ レート制限超過: IP=${ip}`))
    return { success: false, error: 'しばらく時間をおいてから再送してください' }
  }
}
```

**なぜ `x-forwarded-for` ではなく `x-real-ip` か**: `x-forwarded-for` はリクエストヘッダーに攻撃者が任意の値を付加して偽装できます。Vercel が付与する `x-real-ip` は偽装できません。

**Fail-open について**: Redis に障害が起きた場合、try/catch で握りつぶして送信を通します。可用性をセキュリティより優先した意図的な設計です（Slack にエラー通知は飛びます）。

---

## 4. ハニーポット

**ファイル**: `src/components/forms/ContactForm.tsx`、`src/lib/actions/contact.ts`

**何をしているか**: フォームに見えない入力欄（`name="website"`）を追加しています。人間のユーザーはこの欄を見えないので入力しませんが、ページを機械的に解析して全フィールドを埋めるボットは入力してしまいます。Server Action 側でこのフィールドに値があれば、エラーを返さず成功を偽装してサイレントに棄却します（ボットに「失敗した」と気づかせない）。

```tsx
// src/components/forms/ContactForm.tsx（実際のコード）
<input
  type="text"
  name="website"
  className="sr-only"
  tabIndex={-1}
  aria-hidden="true"
/>
```

```typescript
// src/lib/actions/contact.ts（実際のコード）
if (formData.get('website')) {
  return { success: true, id: 'honeypot' }  // 成功に見せてサイレント棄却
}
```

---

## 5. CSRF 対策（Next.js Server Actions）

**ファイル**: `src/lib/actions/contact.ts`

**何をしているか**: Next.js の Server Actions は自動的に CSRF 対策を行っています。具体的には、リクエストの `Origin` ヘッダーと `Referer` ヘッダーを検証し、別ドメインからの送信を弾きます。自前で CSRF トークンを実装する必要はありません。

> API Route（`/api/contact`）を外部公開する場合はこの自動保護が効かないため、別途 CSRF トークン検証が必要になります。

---

## 6. セキュリティヘッダー

**ファイル**: `next.config.ts`

全ページのレスポンスに以下のヘッダーが付きます。

| ヘッダー | 設定値 | 何をするか |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ブラウザに「このドメインは常に HTTPS で接続せよ」と伝える。HTTP でアクセスしても自動で HTTPS にリダイレクトされる |
| `X-Frame-Options` | `SAMEORIGIN` | このサイトを `<iframe>` で埋め込めるのは同一ドメインのみ。クリックジャッキング攻撃の防止 |
| `X-Content-Type-Options` | `nosniff` | ブラウザが Content-Type を勝手に推測するのを禁止。スクリプトとして実行されるべきでないファイルが実行されるのを防ぐ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 別ドメインへのリンクをクリックした際に、URL のパスを Referer ヘッダーに含めない。フォームの入力内容等が外部に漏れるのを防ぐ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | カメラ・マイク・位置情報 API の使用を全て禁止する |
| `Content-Security-Policy` | （下記参照） | どのドメインからのリソース読み込みを許可するかを制限する |

**CSP（Content-Security-Policy）について**:

```
default-src 'self'          → デフォルトは自ドメインのリソースのみ許可
script-src 'self' 'unsafe-eval' 'unsafe-inline'  → Three.js の WebGL シェーダーに必要なため緩和中
style-src 'self' 'unsafe-inline'  → Tailwind のインラインスタイルのため
img-src 'self' data: blob:  → Canvas/WebGL の画像出力のため data: と blob: を許可
connect-src 'self' https://*.neon.tech  → Neon への DB 接続のみ許可
```

> `unsafe-eval` を許可しているのは Three.js の GLSL シェーダーコンパイルが必要なためです。Post-launch TODO として nonce ベース CSP への移行が挙がっています（[security.md §5](security.md)）。

---

## 7. httpOnly Cookie（A/B テスト用）

**ファイル**: `src/proxy.ts`

**何をしているか**: A/B テストで使う `variant` Cookie を `httpOnly: true` で設定しています。`httpOnly` Cookie は JavaScript（`document.cookie`）からアクセスできないため、XSS 攻撃で Cookie が盗まれるリスクを下げます。

```typescript
// src/proxy.ts（実際のコード）
res.cookies.set('variant', v, {
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,   // ← JS からアクセス不可
  path: '/',
})
```

---

## 8. 環境変数管理

**ファイル**: `.env.example`、`.env.local`（gitignore 済み）

**何をしているか**: DB 接続文字列・API キーをコードにハードコードせず、環境変数で管理します。`NEXT_PUBLIC_` プレフィックスをつけると値がブラウザの JS バンドルに含まれるため、サーバー専用の値には絶対につけません。

| プレフィックス | ブラウザに公開 | 使用例 |
|---|---|---|
| `NEXT_PUBLIC_` | される | GA トラッキング ID 等、公開して問題ないもの |
| なし | されない | `DATABASE_URL`、`RESEND_API_KEY` 等 |

---

## 実装済み対策の一覧

| 対策 | 実装ファイル | 状態 |
|---|---|---|
| 入力バリデーション（Zod） | `src/lib/validations/contact.ts` | ✅ |
| SQL インジェクション対策 | `src/lib/db/queries/contact.ts` | ✅ Drizzle ORM |
| レート制限（スライディングウィンドウ） | `src/lib/actions/contact.ts` | ✅ |
| ハニーポット | `src/components/forms/ContactForm.tsx` | ✅ |
| CSRF 対策 | `src/lib/actions/contact.ts` | ✅ Server Actions 自動対策 |
| セキュリティヘッダー（CSP・HSTS 等） | `next.config.ts` | ✅ |
| httpOnly Cookie | `src/proxy.ts` | ✅ |
| 環境変数管理 | `.env.local` / Vercel 環境変数 | ✅ |
| 構造化ログ・外部転送 | — | ❌ Post-launch TODO |
| Cloudflare Turnstile（Bot 対策強化） | — | ❌ Post-launch TODO |
| CSP nonce 化 | — | ❌ Post-launch TODO |
