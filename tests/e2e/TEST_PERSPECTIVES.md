# E2E テスト観点

## 概要

Playwright を用いた E2E テスト。`pnpm test:e2e` で実行。

サーバーは `DATABASE_URL` にダミー値を設定することで DB 書き込みをスキップし、
フォーム送信フローを実際の外部サービスなしにテスト可能（`contact.ts` に `dummy` 分岐あり）。

---

## ファイル構成

| ファイル | 対象 |
|---|---|
| `lp.spec.ts` | LP の全共通セクション表示確認 |
| `variants.spec.ts` | A/B テスト（バリアント別コピー・CTA・Cookie）|
| `contact.spec.ts` | お問い合わせフォーム（正常系・バリデーション・ハニーポット）|
| `navigation.spec.ts` | ヘッダー・フッターのナビゲーションリンク |
| `pages.spec.ts` | About・プライバシーポリシー・送信完了ページ |

---

## テスト観点一覧

### 1. LP 共通セクション（`lp.spec.ts`）

| # | 観点 | 確認内容 |
|---|---|---|
| LP-01 | ヒーロー見出し | バリアント A の `h1` が表示される |
| LP-02 | 実績数値 | StatsSection の「5,000社以上」「50,000名以上」「120,000件以上」が表示 |
| LP-03 | サービス特徴 | ServicesSection の見出し「サービスの特徴」が表示 |
| LP-04 | ご利用の流れ | HowItWorksSection の見出し「ご利用の流れ」が表示 |
| LP-05 | 利用者の声 | TestimonialsSection の見出し「ご利用者の声」が表示 |
| LP-06 | よくある質問 | FAQSection の見出し「よくある質問」が表示 |
| LP-07 | CTA セクション | CTA 見出しと `/contact` リンクが表示 |

### 2. A/B バリアント（`variants.spec.ts`）

| # | 観点 | 確認内容 |
|---|---|---|
| VAR-01 | Variant A のコピー | `heroHeadline`「人と企業の、最適な出会いを。」が表示 |
| VAR-02 | Variant A の CTA | `ctaHeadline`「まず、話してみませんか。」・`primaryCta`「無料で相談する」が表示 |
| VAR-03 | Variant B のコピー | `heroHeadline`「次のキャリアは、ここから始まる。」が表示 |
| VAR-04 | Variant B の CTA | `ctaHeadline`「今が、動くタイミングだ。」・`primaryCta`「今すぐ始める」が表示 |
| VAR-05 | Variant C のコピー | `heroHeadline`「あなたの可能性を、一緒に広げよう。」が表示 |
| VAR-06 | Variant C の CTA | `ctaHeadline`「一緒に、次のステップを考えよう。」・`primaryCta`「まずは話を聞いてみる」が表示 |
| VAR-07 | Cookie 初回付与 | Cookie なしで訪問すると `variant` Cookie が A または C で付与される（B はアクティブ外）|
| VAR-08 | Cookie の永続化 | `?__variant=B` 強制後にリロードしても B のコピーが表示される |

### 3. お問い合わせフォーム（`contact.spec.ts`）

| # | 観点 | 確認内容 |
|---|---|---|
| CON-01 | 正常系 | 全フィールド入力・同意チェック・送信 → `/contact/success` にリダイレクト |
| CON-02 | 空送信バリデーション | 何も入力せず送信 → `role="alert"` と「お名前を入力してください」が表示 |
| CON-03 | メールバリデーション | 不正なメールアドレスで送信 → 「有効なメールアドレスを入力してください」が表示 |
| CON-04 | 同意なし送信 | チェックボックスを押さず送信 → エラーアラートが表示される |
| CON-05 | ハニーポット | hidden `website` フィールドを JS で入力して送信 → サイレントに `/contact/success` へ |

### 4. ナビゲーション（`navigation.spec.ts`）

| # | 観点 | 確認内容 |
|---|---|---|
| NAV-01 | ロゴリンク | ヘッダーロゴが `href="/"` を持ち、ホームへ戻るリンクとして識別される |
| NAV-02 | ヘッダー「会社について」| クリックで `/about` に遷移 |
| NAV-03 | ヘッダー「お問い合わせ」| クリックで `/contact` に遷移 |
| NAV-04 | ヘッダー CTA ボタン | 「無料で相談する」が `href="/contact"` を持つ |
| NAV-05 | フッター「会社について」| クリックで `/about` に遷移 |
| NAV-06 | フッター「お問い合わせ」| クリックで `/contact` に遷移 |
| NAV-07 | フッター「プライバシーポリシー」| クリックで `/privacy-policy` に遷移 |
| NAV-08 | フッター著作権表示 | 「Jobify. All rights reserved.」が表示 |

### 5. 各ページ（`pages.spec.ts`）

| # | 観点 | 確認内容 |
|---|---|---|
| PAG-01 | About: ミッション見出し | 「はたらく人の、可能性を広げる。」(h1) が表示 |
| PAG-02 | About: 会社概要テーブル | 「会社概要」見出しと「株式会社ジョビファイ（モック）」が表示 |
| PAG-03 | About: チームセクション | 「チーム」見出しと「山田 太郎」「鈴木 花子」が表示 |
| PAG-04 | プライバシー: タイトル | 「プライバシーポリシー」(h1) が表示 |
| PAG-05 | プライバシー: 全6セクション | セクション1〜6の見出しがすべて表示される |
| PAG-06 | プライバシー: 外部委託先 | Neon・Resend・Upstash の記載が表示 |
| PAG-07 | 送信完了: 見出し | 「送信が完了しました」(h1) が表示 |
| PAG-08 | 送信完了: ホーム遷移 | 「トップページに戻る」リンクをクリックで `/` に遷移 |

---

## テスト環境メモ

- バリアント強制: `?__variant=A|B|C` クエリパラメータで Cookie を上書き可能（`src/proxy.ts`）
- DB スキップ: E2E 用 `DATABASE_URL` が `dummy` を含む場合、DB 書き込みをスキップして `{ success: true, id: 'dummy-id-for-e2e-test' }` を返す
- レート制限: `NODE_ENV === 'development'` の場合は Upstash Redis レート制限を無効化
- ハニーポット: `name="website"` の hidden 入力が埋まっている場合、`{ success: true, id: 'honeypot' }` を返してサイレントにリダイレクト
