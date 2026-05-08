# HP Project

Vercel + Neon を用いた商用グレードのコーポレートサイト。

## ドキュメント

| ドキュメント | 概要 |
|---|---|
| [要件定義書](docs/requirements.md) | 機能・非機能要件、制約条件 |
| [アーキテクチャ設計書](docs/architecture.md) | システム構成、コンポーネント設計、データフロー |
| [実装方針書](docs/implementation-guide.md) | ディレクトリ構造、コーディング規約、実装順序 |
| [デザイン仕様書](docs/design.md) | 3コンセプト詳細、デザイントークン、A/Bテスト設計 |
| [DB設計書](docs/database.md) | テーブル定義、インデックス、マイグレーション方針 |
| [セキュリティ設計書](docs/security.md) | 脅威モデル、対策一覧、チェックリスト |

## Quick Start

```bash
# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env.local

# DB マイグレーション
pnpm db:migrate

# 開発サーバー起動
pnpm dev
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui + Tailwind CSS v4
- **3D**: @react-three/fiber + @react-three/drei
- **DB**: Neon (Serverless Postgres) + Drizzle ORM
- **Form**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Hosting**: Vercel
