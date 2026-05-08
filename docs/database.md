# DB 設計書

**バージョン**: 1.3  
**作成日**: 2026-05-08  
**更新日**: 2026-05-08  
**DB エンジン**: Neon (PostgreSQL 17)  
**ORM**: Drizzle ORM

---

## 1. テーブル一覧

| テーブル名 | 概要 | フェーズ |
|---|---|---|
| `contact_submissions` | お問い合わせ投稿 | Phase 1 |
| `users` | 管理ユーザー | 将来 |

---

## 2. テーブル定義

### 2.1 contact_submissions

お問い合わせフォームの投稿データ。

| カラム名 | 型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | ○ | `gen_random_uuid()` | PK |
| `name` | varchar(100) | ○ | - | 氏名 |
| `email` | varchar(255) | ○ | - | メールアドレス |
| `subject` | varchar(200) | ○ | - | 件名 |
| `body` | varchar(2000) | ○ | - | 本文（Zod と DB 両方で上限を担保）|
| `status` | contact_status | ○ | `'new'` | ステータス（pgEnum で型安全）|
| `ip_address` | varchar(45) | ✗ | NULL | 送信元IP (IPv6対応、将来 inet 型への移行を検討) |
| `user_agent` | varchar(512) | ✗ | NULL | User-Agent（上限設定でストレージ保護）|
| `variant` | ab_variant | ✗ | NULL | A/B テストバリアント（pgEnum: 'A' / 'B' / 'C'）|
| `idempotency_key` | varchar(36) | ✗ | NULL | 重複送信防止キー（クライアント生成 UUID）|
| `deleted_at` | timestamptz | ✗ | NULL | ソフトデリート日時（NULL = 有効）|
| `created_at` | timestamptz | ○ | `now()` | 作成日時 |
| `updated_at` | timestamptz | ○ | `now()` | 更新日時（トリガーで自動更新）|

**status の取りうる値**:
- `new` - 未対応
- `in_progress` - 対応中
- `resolved` - 解決済み
- `spam` - スパム

**variant の取りうる値**: `'A'` / `'B'` / `'C'`（A/B テスト勝者決定後は NULL でも可）

**インデックス**:
```sql
-- 単一カラム
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_variant ON contact_submissions(variant);
-- 部分インデックス: 有効レコードのみ対象（ソフトデリート済みは除外）
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email)
  WHERE deleted_at IS NULL;

-- 複合インデックス: 実クエリパターンに対応
-- 「同一メールの直近N件」「スパム判定クエリ」
CREATE INDEX idx_email_created_at ON contact_submissions(email, created_at DESC)
  WHERE deleted_at IS NULL;
-- 「未対応件数」「ステータス別集計」
CREATE INDEX idx_status_created_at ON contact_submissions(status, created_at DESC)
  WHERE deleted_at IS NULL;
```

**idempotency_key の制約**:
```sql
CREATE UNIQUE INDEX idx_idempotency_key ON contact_submissions(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
```

---

## 3. Drizzle スキーマ定義

```typescript
// src/lib/db/schema.ts
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// varchar ではなく pgEnum で型安全を担保する
// 誤った値がDBに混入しても DB レベルで拒否される
export const contactStatusEnum = pgEnum('contact_status', [
  'new',
  'in_progress',
  'resolved',
  'spam',
])

export const abVariantEnum = pgEnum('ab_variant', ['A', 'B', 'C'])

export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 200 }).notNull(),
    // text → varchar(2000): DB レベルで上限を担保する
    body: varchar('body', { length: 2000 }).notNull(),
    status: contactStatusEnum('status').notNull().default('new'),
    // varchar(45): IPv6 最大長 39 文字 + 余裕。将来 inet 型への移行を検討。
    ipAddress: varchar('ip_address', { length: 45 }),
    // text → varchar(512): 際限なく長い UA 文字列によるストレージ肥大を防ぐ
    userAgent: varchar('user_agent', { length: 512 }),
    variant: abVariantEnum('variant'),
    // 重複送信防止: クライアントが formMount 時に生成した UUID を送信
    idempotencyKey: varchar('idempotency_key', { length: 36 }),
    // ソフトデリート: NULL = 有効、値あり = 削除済み
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    // ⚠️ updatedAt は Drizzle が自動更新しない。
    //    別途 updated_at トリガーをマイグレーションで作成すること。(§5b 参照)
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => ({
    // 部分インデックス: ソフトデリート済みを除外
    emailIdx: index('idx_contact_submissions_email')
      .on(table.email)
      .where(sql`${table.deletedAt} IS NULL`),
    createdAtIdx: index('idx_contact_submissions_created_at').on(
      table.createdAt
    ),
    variantIdx: index('idx_contact_submissions_variant').on(table.variant),
    // 複合インデックス: 実クエリパターンに対応
    emailCreatedAtIdx: index('idx_email_created_at')
      .on(table.email, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),
    statusCreatedAtIdx: index('idx_status_created_at')
      .on(table.status, table.createdAt)
      .where(sql`${table.deletedAt} IS NULL`),
    // idempotency_key のユニーク制約
    idempotencyKeyIdx: index('idx_idempotency_key')
      .on(table.idempotencyKey)
      .where(sql`${table.idempotencyKey} IS NOT NULL`),
  })
)

// 型エクスポート
export type ContactSubmission = typeof contactSubmissions.$inferSelect
export type NewContactSubmission = typeof contactSubmissions.$inferInsert
export type ContactStatus = typeof contactStatusEnum.enumValues[number]
export type AbVariant = typeof abVariantEnum.enumValues[number]
```

---

## 4. Drizzle クライアント設定

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
```

---

## 5. クエリ定義

```typescript
// src/lib/db/queries/contact.ts
import { db } from '@/lib/db'
import { contactSubmissions, type NewContactSubmission } from '@/lib/db/schema'

export async function insertContact(data: Omit<NewContactSubmission, 'id' | 'createdAt' | 'updatedAt'>) {
  const [result] = await db
    .insert(contactSubmissions)
    .values({
      ...data,
      // メールアドレスを小文字に正規化（例: Example@Gmail.com → example@gmail.com）
      // 同一ユーザーの履歴を後から集計する際の名寄せコストを下げる
      email: data.email.toLowerCase(),
    })
    .returning({ id: contactSubmissions.id })
  return result
}

// ソフトデリート（個人情報削除依頼への対応）
// 物理削除ではなく deleted_at を設定し、削除した事実を記録に残す
export async function softDeleteContactByEmail(email: string) {
  await db
    .update(contactSubmissions)
    .set({ deletedAt: new Date() })
    .where(eq(contactSubmissions.email, email.toLowerCase()))
}

// 通常のクエリでは deleted_at IS NULL で有効レコードのみを対象にする
export async function getActiveContacts() {
  return db
    .select()
    .from(contactSubmissions)
    .where(isNull(contactSubmissions.deletedAt))
    .orderBy(desc(contactSubmissions.createdAt))
}
```

---

## 5b. updated_at 自動更新トリガー

**背景**: Drizzle ORM は UPDATE 時に `updated_at` を自動更新しない。DB トリガーで補完する。

```sql
-- drizzle/migrations/0002_add_updated_at_trigger.sql
-- ⚠️ Drizzle Kit はトリガー・関数を自動生成しない。
--    pnpm db:migrate 後に Neon SQL Editor または psql で手動実行すること。

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

> **適用確認**: `UPDATE contact_submissions SET status='in_progress' WHERE id='...'`  
> 実行後に `updated_at` が変わっていることを確認する。

---

## 6. マイグレーション方針

```bash
# スキーマ変更後にマイグレーションファイルを生成
pnpm db:generate

# ローカル DB に適用
pnpm db:migrate

# 本番 (Vercel 環境変数を使用)
DATABASE_URL=<本番URL> pnpm db:migrate
```

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,  // マイグレーションは直接接続
  },
} satisfies Config
```

> **注意**: マイグレーションは必ず `DATABASE_URL_UNPOOLED`（直接接続）を使用する。  
> Pooler 経由ではセッションレベルのトランザクションが正常に動作しない。

---

## 7. データ保持ポリシー

個人情報（氏名・メール・IP）を保存するため、保持期間を明文化する。

| データ | 保持期間 | 根拠 | 削除方法 |
|---|---|---|---|
| 問い合わせ本文・氏名・メール | **3年**（最終更新から） | 問い合わせ対応・監査目的として合理的 | 手動 または Cron |
| IP アドレス | **90日** | セキュリティ調査に必要な最低期間 | Cron（Post-launch TODO）|
| `spam` ステータスのレコード | **30日** | 不要データの早期削除 | Cron（Post-launch TODO）|
| ソフトデリート済みレコード | **90日** | 誤削除のリカバリ猶予期間 | Cron（Post-launch TODO）|

> **APPI（個人情報保護法）**: 利用目的の達成に必要な範囲を超えた保存は禁止。  
> 3年を超えた場合は `deleted_at` を設定してソフトデリートし、その後 Cron で物理削除する。

---

## 8. ステータス遷移ルール

```
         ┌──────────────────────────────┐
         │              new             │ ← 初期状態
         └──────┬───────────┬────┬──────┘
                │           │    │
         着手する│     即解決│    │スパム判定
                ▼           ▼    ▼
         ┌────────────┐  ┌───────────┐  ┌────────┐
         │in_progress │  │ resolved  │  │  spam  │
         └──────┬─────┘  └─────┬─────┘  └───┬────┘
                │               │            │
         解決する│         再オープン│      誤判定修正│
                ▼               ▼            ▼
         ┌────────────┐       new          new
         │  resolved  │
         └────────────┘
```

**遷移許可一覧**:

| 現在 → 次 | 許可 | 備考 |
|---|---|---|
| new → in_progress | ○ | 担当者が着手 |
| new → resolved | ○ | 電話等で即解決した場合 |
| new → spam | ○ | スパム判定 |
| in_progress → resolved | ○ | 対応完了 |
| in_progress → spam | ○ | 対応中にスパムと判明 |
| resolved → in_progress | ○ | 再問い合わせ・再オープン |
| spam → new | ○ | 誤判定の修正 |
| any → deleted_at | ○ | 削除依頼（ソフトデリート） |

> 遷移制約は将来の管理画面実装時に Server Action レイヤーで実装する（DB 制約ではなくアプリ制御）。

---

## 9. 重複送信対策（Idempotency）

**採用方針**: フロントエンドによるボタン無効化 + オプションの idempotency_key

```typescript
// ContactForm.tsx - フォームマウント時に UUID を生成
const idempotencyKey = useRef(crypto.randomUUID())

// Server Action に送信
formData.append('idempotency_key', idempotencyKey.current)
```

```typescript
// lib/db/queries/contact.ts
export async function insertContactIdempotent(
  data: Omit<NewContactSubmission, 'id' | 'createdAt' | 'updatedAt'>
) {
  // INSERT ... ON CONFLICT DO NOTHING でアトミックに処理する。
  // SELECT → INSERT の2ステップだと同時リクエスト時に UNIQUE 制約違反が発生する。
  const [result] = await db
    .insert(contactSubmissions)
    .values({ ...data, email: data.email.toLowerCase() })
    .onConflictDoNothing({ target: contactSubmissions.idempotencyKey })
    .returning({ id: contactSubmissions.id })

  if (result) return result

  // Conflict hit: 既存レコードの id を返す（重複送信扱い）
  const [existing] = await db
    .select({ id: contactSubmissions.id })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.idempotencyKey, data.idempotencyKey!))
    .limit(1)
  return existing
}
```

> **なぜ2段階になっているか**: `onConflictDoNothing` はコンフリクト時に `returning()` が空配列を返す。
> INSERT が競合した場合のみ SELECT を行うため、通常パスは1クエリで完了する。

---

## 10. Neon Free Tier の現実

### ストレージ使用量見込み

| シナリオ | 1件あたり | 月件数 | 月ストレージ |
|---|---|---|---|
| 通常運用 | ~1 KB | 1,000件 | ~1 MB |
| スパム攻撃（最悪ケース）| ~1.5 KB | 50,000件 | ~75 MB |

→ スパム攻撃でも無料枠 0.5 GB の 15% 程度。  
→ ただし Cron で `spam` レコードを 30日後削除しないと累積リスクあり。

### コールドスタート

Neon Free Tier はアイドル 5分後にコンピュートが自動サスペンドする。  
**再起動時: 500ms〜2秒の遅延が発生**（深夜・週末の最初のフォーム送信で体感される）。

| 対策 | コスト | 効果 |
|---|---|---|
| 許容する（MVP 推奨） | 無料 | 遅延あり |
| Neon Launch プラン ($5/月) | $5/月 | サスペンドなし |
| Keepalive Cron（/api/ping を5分おきに叩く）| Vercel Cron 無料枠 | 実質無効化（非推奨: リソース浪費）|

> MVP リリース時は**許容する**。トラフィック増加後に Launch プランへ移行する。

---

## 11. 本番マイグレーション安全手順

**初期リリース時**（テーブル新規作成のみ）はリスク低。以下は将来のカラム追加・変更時に適用する。

```
本番マイグレーション手順:

1. [ ] Neon ダッシュボードでスナップショットを取得 (またはPITRのベースポイントを確認)
2. [ ] pnpm db:generate でマイグレーションSQL を生成
3. [ ] 生成された SQL をレビュー (不可逆な DROP や ALTER が含まれていないか確認)
4. [ ] ステージング環境 (Neon Branch) で適用テスト
       → neon branches create --name staging でブランチ作成
5. [ ] メンテナンス窓 or 低トラフィック時間帯に実行
6. [ ] DATABASE_URL=<本番URL> pnpm db:migrate
7. [ ] 動作確認（フォーム送信テスト）
8. [ ] 問題発生時: Neon の PITR でロールバック
       → neon restore <branch> --to-timestamp <時刻>
```

**ロールバック可能な変更（安全）**:
- 新カラム追加（NOT NULL 制約なし or DEFAULT あり）
- 新インデックス追加
- 新テーブル追加

**慎重に扱う変更**:
- カラム削除 → 先にアプリ側で参照を削除してからマイグレーション
- 型変更 → 新カラム追加 → データ移行 → 旧カラム削除の3ステップで実施
- NOT NULL 追加 → 既存レコードへの影響を確認

---

## 12. 将来の設計候補（現フェーズでは非実装）

### inet 型への移行（データエンジニア推奨）

PostgreSQL の `inet` 型は IP アドレス専用で、バリデーション・CIDR 演算・インデックス効率が `varchar` より優れる。  
管理画面で IP ベースのブロック機能を作る場合に有効。現フェーズでは `varchar(45)` で十分。

```typescript
// 将来の移行先コード例
import { customType } from 'drizzle-orm/pg-core'
const inet = customType<{ data: string }>({ dataType: () => 'inet' })
ipAddress: inet('ip_address'),
```

### 担当者・対応履歴テーブル（管理画面フェーズで追加）

```sql
-- 将来追加するテーブル
CREATE TABLE contact_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES contact_submissions(id),
  actor_id uuid,                          -- 担当者（将来の users テーブルへの FK）
  action varchar(50) NOT NULL,            -- 'status_changed' | 'replied' | 'deleted'
  old_value text,
  new_value text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```
