# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このプロジェクトについて

求人サービスのコーポレートHP。フォーム投稿受付・A/Bテスト（3デザインコンセプト）・3D演出を含む。
`src/` はディレクトリ骨格のみ（`.gitkeep`）で、実装はこれから始まる段階。

**スタック**: Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui · @react-three/fiber · Drizzle ORM · Neon Postgres · Upstash Redis · Resend · Framer Motion · Vercel

---

## ドキュメント構成と読む順番

```
requirements.md          何を作るか・制約・Post-launch TODO
      ↓
architecture.md          全体構成・ADR（技術選定の根拠）・データフロー図
      ↓
design.md                LP セクション仕様・モックコピー・A/Bテスト設計・CSS トークン
      ↓
database.md              Drizzle スキーマ・クエリパターン・データ保持ポリシー
      ↓
security.md              レート制限・OWASP対策の実装コード・インシデント対応
      ↓
implementation-guide.md  フェーズ別タスクリスト・コーディング規約（← 実装時の起点）
```

迷ったら `implementation-guide.md` を起点に参照先を辿る。

---

## src/ ディレクトリ構造

```
src/
├── app/
│   ├── (marketing)/          # 公開ページ（LP・about・contact・privacy-policy）
│   ├── (dashboard)/          # 将来の管理画面（現在は空）
│   └── api/contact/          # 外部 Webhook 用 API Route
├── components/
│   ├── ui/                   # shadcn/ui（npx shadcn add で生成するため手書き禁止）
│   ├── layout/               # Header・Footer・Navigation
│   ├── sections/             # LP セクション（hero/ 配下のみバリアント別）
│   └── canvas/               # Three.js（'use client' 必須）
├── lib/
│   ├── db/                   # Drizzle クライアント・schema.ts・queries/
│   ├── variants/             # types.ts・config.ts（A/Bテスト設定）
│   ├── validations/          # Zod スキーマ（クライアント・サーバー共有）
│   ├── actions/              # Server Actions
│   └── email/                # Resend テンプレート
└── types/                    # 共通型定義
```

**重要ファイル**:
- `src/proxy.ts` — Next.js 16 の公式規約（旧 `middleware.ts`、[移行ドキュメント](https://nextjs.org/docs/messages/middleware-to-proxy)）。`proxy` という名前で export する。**Edge Runtime がデフォルト**のため DB の実体インポート不可（`import type` のみ可）。**このファイルがないと A/B テストが機能しない**
- `drizzle.config.ts` — マイグレーション時に `DATABASE_URL_UNPOOLED`（直接接続）を参照する設定
- `next.config.ts` — CSP・セキュリティヘッダーが定義される（`security.md §2.1` と対応）

---

## ドキュメント間の依存関係（実装時に参照するポイント）

### A/Bテスト実装
- CSS トークン（カラー・フォント）→ `design.md §3〜§5`
- LP の各セクションが共通かバリアント別かの一覧 → `design.md §1`
- モックコピー・CTA テキスト・3D仕様 → `design.md §2`
- `variantConfig`（ランタイム設定値）→ `design.md §7.3`
- `Variant` 型は `lib/variants/types.ts` が正。`abVariantEnum.enumValues` から派生させる（`design.md §7.3` 参照）

### フォーム投稿フロー
- エンドツーエンドの流れ図 → `architecture.md §4.1`
- Server Action・Zod スキーマのコード → `implementation-guide.md §4`
- DB スキーマ・idempotency クエリ → `database.md §3, §9`
- レート制限コード → `security.md §2.2`
- メールテンプレート仕様 → `implementation-guide.md §8`

### DB スキーマ変更時
- Drizzle スキーマ定義 → `database.md §3`
- マイグレーション安全手順 → `database.md §6, §11`
- `updated_at` トリガー（Drizzle Kit は自動生成しない）→ `database.md §5b`

---

## 開発コマンド

```bash
pnpm install
cp .env.example .env.local   # 全項目を埋めてから起動

pnpm db:generate             # schema.ts からマイグレーションファイル生成
pnpm db:migrate              # DB に適用（DATABASE_URL_UNPOOLED を使用）

pnpm dev
pnpm build
pnpm lint
pnpm tsc --noEmit
pnpm test --run              # Vitest
pnpm test:e2e                # Playwright
```

---

## やってはいけない / ハマりポイント

- **API Route に Edge Runtime を使わない** — Neon 接続が切れる。Node.js runtime 固定（`requirements.md §4`）
- **レート制限は `x-forwarded-for` を使わない** — Vercel では偽装可能。`x-real-ip` を使う（`security.md §2.2`）
- **`pnpm db:migrate` 後に `updated_at` トリガーを手動で Neon SQL Editor から実行する** — Drizzle Kit はトリガーを自動生成しない（`database.md §5b`）
- **FormData のチェックボックスは `'on'` で来る** — Server Action で `agreed: rawData.agreed === 'on'` に変換してから Zod に渡す（`implementation-guide.md §4`）
- **`Variant` 型の二重定義は意図的** — `src/proxy.ts` は Edge Runtime で動くため DB インポートが不可。`proxy.ts` のみローカル型定義を持つ。`lib/variants/types.ts` は RSC / Server Action 側で使う

---

## 実装開始前チェック

詳細は `implementation-guide.md §2`（Phase 0〜1）。

**Resend を最初に設定する**（DNS 認証に最大24時間かかるため）。

Phase 1 で2つの互換性確認が必要:
1. `shadcn/ui + Tailwind CSS v4` — Button を追加してスタイルが当たるか確認してから進む
2. `@react-three/fiber v8 + React 19` — minimal Canvas で描画確認。NG なら `^9.0.0-rc.x` を試す
