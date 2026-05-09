# MORE Tasks (Post-launch & Future Enhancements)

**作成日**: 2026-05-09  
**対象プロジェクト**: Jobify コーポレートHP (modern-hp)

初期リリース（Phase 1 〜 6 および OGメタデータ）の実装は完了しました。本ドキュメントは、リリース後に対応すべき運用・保守・拡張タスク（`requirements.md`, `security.md`, `database.md` などに散在していた残件）を集約したものです。

---

## 1. インフラ・セキュリティ・運用保守

| 優先度 | タスク名 | 概要 | 関連ドキュメント |
|---|---|---|---|
| 高 | **構造化ログ + 外部ログ転送** | セキュリティイベントを JSON 形式で Axiom / Datadog 等へ転送。Vercel ログの 30 日制限を超えたフォレンジック調査を可能にする。 | `requirements.md` / `security.md` |
| 高 | **Neon バックアップ方針の明文化** | PITR 保持期間の確認・定期スナップショット取得手順を運用ドキュメント化する。 | `requirements.md` |
| 完了 | **DB の updated_at トリガー適用** | カスタムマイグレーション (`0001_add_updated_at_trigger.sql`) として実装済み。 | `database.md` §5b |
| 高 | **Cloudflare Turnstile 実装** | スパムボット対策。現在は Honeypot + レート制限で代替しているが、スパム増加確認時に前倒しで対応する。 | `requirements.md` / `security.md` |
| 中 | **データ自動削除 Cron** | IP: 90日後 NULL 化 / spam レコード: 30日後物理削除 / 3年超レコード: ソフトデリート。Vercel Cron Jobs で実装。 | `database.md` §7 |
| 中 | **CSP nonce 化** | 現在 `unsafe-eval` を Three.js のため許可しているが、nonce ベース CSP に移行して XSS リスクを低減する。 | `requirements.md` / `security.md` |
| 低 | **メール送信失敗アラート** | Resend の送信失敗を検知して Slack へ通知する仕組みの整備。 | `requirements.md` |
| 低 | **SBOM 整備** | `pnpm list --depth=0` 等で依存ライブラリのインベントリ作成によるサプライチェーンリスクの可視化。 | `requirements.md` |

## 2. A/B テスト・マーケティング施策

| タスク名 | 概要 | 関連ドキュメント |
|---|---|---|
| **Phase 2 の開始 (バリアント B の追加)** | Phase 1 (A vs C) の勝者が確定した後、`src/proxy.ts` の `ACTIVE_VARIANTS` を `['A', 'B', 'C']` に変更し、ダークモード (BOLD) の有効性を検証する。 | `design.md` §7.6 |
| **コンバージョン分析環境の構築** | バリアント別のお問い合わせ率を出すため、Google Analytics (GA4) または Vercel Web Analytics のイベントトラッキングを実装する。 | `design.md` §7.4 |
| **勝者決定後のコード削除** | 最低 4 週間 / 30 件のデータが集まり、統計的有意性が確認されて勝者が決まった後、敗退したコンポーネントや Three.js 演出を削除し、コードベースを軽量化する。 | `design.md` §7.4 |

## 3. 将来の機能拡張 (ロードマップ)

1. **Webhook 用 API Route**: 現在は Server Actions のみ。外部サービス連携が必要になった場合 `/api/contact/route.ts` を実装。
2. **管理画面の追加**: `/dashboard` ディレクトリに、お問い合わせ一覧・ステータス管理機能を追加。
3. **ユーザー認証**: 管理画面へのアクセス制限のため、NextAuth.js または Clerk を導入。
4. **CMS 連携**: Contentful / Sanity を用いて、ブログや求人情報を動的に管理。
5. **多言語対応**: next-intl 等を用いた URL 設計（`/ja/`, `/en/`）の導入。
