# デザイン仕様書

**バージョン**: 1.2  
**作成日**: 2026-05-08  
**更新日**: 2026-05-08  
**対象**: LP (/) / A/B テスト 3コンセプト

---

## 1. LP セクション構成（全コンセプト共通）

```
┌─────────────────────────────┐
│  Header                     │  Logo + Nav + CTA ボタン（スクロール時透過→不透明切替）
├─────────────────────────────┤
│  Hero                       │  大見出し + サブコピー + CTA × 2 + 3D Canvas
├─────────────────────────────┤
│  Stats                      │  数字で示す実績（3指標）
├─────────────────────────────┤
│  Logo Bar                   │  導入企業ロゴカルーセル（6社）
├─────────────────────────────┤
│  Services                   │  サービスの特徴（タブ切替: 転職希望者 / 採用企業）
├─────────────────────────────┤
│  Full-Bleed Photo           │  現場・チーム写真（全幅）
├─────────────────────────────┤
│  How It Works               │  3ステップフロー
├─────────────────────────────┤
│  Testimonials               │  導入企業・成功者の声 3件（顔写真付き）
├─────────────────────────────┤
│  FAQ                        │  よくある質問 4件（アコーディオン）
├─────────────────────────────┤
│  CTA Section                │  お問い合わせへの最終誘導（コンセプト別コピー）
├─────────────────────────────┤
│  Footer                     │  リンク集 + コピーライト
└─────────────────────────────┘
```

### セクション別 共通 / コンセプト別 整理

| セクション | レイアウト | テキスト | カラー |
|---|---|---|---|
| Header | 共通 | 共通 | コンセプト別（`--color-bg` / `--color-border`）|
| Hero | **コンセプト別**（3D演出・フォントが異なる） | コンセプト別 | コンセプト別 |
| Stats | 共通 | 共通 | コンセプト別 |
| Logo Bar | 共通 | 共通 | **コンセプト別**（Bはダーク背景のためロゴ周辺の背景色が変わる）|
| Services | 共通（タブ構造含む） | 共通 | コンセプト別 |
| Full-Bleed Photo | 共通（overlayのみ別） | 共通 | **コンセプト別**（overlay 濃度が異なる。§2参照）|
| How It Works | 共通 | 共通 | コンセプト別 |
| Testimonials | 共通 | 共通 | コンセプト別 |
| FAQ | 共通 | 共通 | コンセプト別 |
| CTA Section | 共通 | **コンセプト別**（見出し・コピー・ボタン。§2参照）| コンセプト別 |
| Footer | 共通 | 共通 | コンセプト別 |

> 実装方針: CSS カスタムプロパティ（`--color-*`）が `data-variant` で切り替わるため、カラーは全セクションで自動的にコンセプト別になる。テキストが異なる箇所のみ `variantConfig` から値を取得する。

---

## 2. モックコンテンツ（初期実装用）

> 本番コンテンツ確定後に差し替える。レイアウト崩れを防ぐため文字数は本番想定に合わせている。

### 共通数値（Stats セクション）
| 指標 | 数値 |
|---|---|
| 登録企業数 | 5,000社以上 |
| 転職成功者数 | 50,000名以上 |
| 公開求人件数 | 120,000件以上 |

> ⚠️ **景品表示法（優良誤認）**: これらの数値は本番コンテンツ確定時に根拠データが必要。実態と乖離した数値の掲載は不当表示にあたる。本番リリース前に担当者が根拠資料を確認・保管すること。（`requirements.md §7`）

### ヒーローコピー（コンセプト別）
| コンセプト | 大見出し（H1） | サブコピー |
|---|---|---|
| A: CONNECTED | 人と企業の、最適な出会いを。 | 5,000社以上の求人から、あなたのキャリアにぴったりの一社を見つけましょう。専任のキャリアアドバイザーが、転職活動を全面サポートします。 |
| B: BOLD | 次のキャリアは、ここから始まる。 | 業界トップクラスの求人データベースと、AIによるマッチングで、理想の職場との出会いを加速させます。 |
| C: HUMAN | あなたの可能性を、一緒に広げよう。 | 転職は人生の大きな決断。だからこそ、私たちは一人ひとりに寄り添い、あなたらしいキャリアを一緒に考えます。 |

### CTA ボタンテキスト（コンセプト別）

| コンセプト | Primary CTA | Secondary CTA |
|---|---|---|
| A: CONNECTED | 「無料で相談する」 | 「求人を探す」 |
| B: BOLD | 「今すぐ始める」 | 「求人を探す」 |
| C: HUMAN | 「まずは話を聞いてみる」 | 「求人を探す」 |

> Primary CTA テキストはコンセプトのトーン（信頼感 / 行動喚起 / 寄り添い）に合わせて変える。A/B テストの計測変数のひとつ。

### ロゴバー（Logo Bar）— 導入企業 6社（モック）

| # | 社名（モック） | 業種 |
|---|---|---|
| 1 | 株式会社テックビジョン | IT・ソフトウェア |
| 2 | グローバルエンタープライズ株式会社 | 総合商社 |
| 3 | フューチャーキャリア株式会社 | 人材・採用 |
| 4 | スマートワークス株式会社 | コンサルティング |
| 5 | ネクストステージ株式会社 | 製造・メーカー |
| 6 | イノベーション・パートナーズ株式会社 | ベンチャー・スタートアップ |

> 実装: CSS `@keyframes marquee` で左スクロールの無限ループ。ロゴは 160×48px の SVG プレースホルダーで初期実装し、本番時に差し替える。

**アクセシビリティ対応**:

```css
/* prefers-reduced-motion 検知時はアニメーションを停止 */
@media (prefers-reduced-motion: reduce) {
  .marquee { animation: none; }
}

/* ホバーで一時停止（WCAG 2.1 AA 2.2.2: 動くコンテンツの一時停止）*/
.marquee-container:hover .marquee,
.marquee-container:focus-within .marquee {
  animation-play-state: paused;
}
```

### Services タブコンテンツ

**タブ 1: 転職希望者向け**
1. **AI マッチング** — 経歴・希望条件を入力するだけで、最適な求人をリアルタイムに提案
2. **専任アドバイザー** — 業界に精通したキャリアアドバイザーが応募から内定まで伴走
3. **非公開求人** — 一般公開されていないプレミアム求人を30,000件以上保有

**タブ 2: 採用企業向け**
1. **候補者データベース** — 登録者5万名超のデータベースから条件に合う候補者を即スクリーニング
2. **採用ブランディング支援** — 企業の魅力を最大化する求人票・採用ページ制作をサポート
3. **費用対効果保証** — 採用成功報酬型のため、採用が決まるまで初期費用0円

### Full-Bleed Photo セクション

| 項目 | 内容 |
|---|---|
| 画像サイズ | 1920 × 800px（アスペクト比 2.4:1） |
| alt テキスト | 「オフィスで打ち合わせをするチームの様子」 |
| 初期実装 | `/images/team-meeting-placeholder.jpg`（Unsplash 無料素材） |
| テキストオーバーレイ文言 | 「5,000社以上の企業と、50,000名以上の転職希望者が利用しています。」（全コンセプト共通）|
| モバイル | `object-position: center top` で人物が切れないよう調整 |

**コンセプト別 overlay 処理**:

| コンセプト | overlay クラス | 理由 |
|---|---|---|
| A: CONNECTED | `bg-slate-900/40` | ライトテーマに対して自然な暗化。テキスト可読性を確保。 |
| B: BOLD | `bg-zinc-950/60 bg-gradient-to-t from-zinc-950` | ダークテーマ（`--color-bg: #09090b`）と写真が馴染みすぎるため、写真下端をフェードアウトさせて境界を明確化。overlay が重い場合はセクション自体をダーク背景+テキストのみに変更してもよい。 |
| C: HUMAN | `bg-stone-900/30` | 温かみを損なわない軽めの overlay。 |

### How It Works 3ステップ
1. **無料登録** — 3分で完了。経歴と希望条件を入力するだけ
2. **マッチング** — AIが最適な求人を選定。アドバイザーが精査してご提案
3. **内定・入社** — 面接対策から条件交渉まで、入社日まで完全サポート

### Testimonials 3件（顔写真付き）

| # | 氏名（モック） | 役職 | 写真仕様 | コメント |
|---|---|---|---|---|
| 1 | 田中 恵子 | エンジニア（転職成功） | 64×64px 円形 / alt: 「田中恵子さんの写真」 | 「アドバイザーの方がとても親身に相談に乗ってくれました。3社から内定をいただき、希望通りの職場に転職できました。」 |
| 2 | 鈴木 浩二 | 採用責任者 | 64×64px 円形 / alt: 「鈴木浩二さんの写真」 | 「採用工数を大幅に削減できました。マッチング精度が高く、書類選考の通過率が2倍以上になっています。」 |
| 3 | 山田 美咲 | マーケター（転職成功） | 64×64px 円形 / alt: 「山田美咲さんの写真」 | 「転職が初めてで不安でしたが、丁寧なサポートのおかげで安心して活動できました。年収も150万円アップしました。」 |

> 写真は初期実装では UI Faces 等のプレースホルダー画像を使用。本番時に実際の声と写真に差し替え。`loading="lazy"` を付与。

> ⚠️ **景品表示法・ステルスマーケティング**: 「年収150万円アップ」等の具体的数値は個人の実績であることを明示すること（例: 「※個人の体験談です」）。謝礼・インセンティブを提供して収集した口コミには「PR」等の表示が必要（2023年10月施行）。収集フローと表示方針を本番前に確定すること。（`requirements.md §7`）

### FAQ 4件

| # | 質問 | 回答 |
|---|---|---|
| 1 | 利用は本当に無料ですか？ | 転職希望者の方は完全無料でご利用いただけます。費用は採用企業様からの成功報酬のみです。 |
| 2 | 在職中でも利用できますか？ | はい、在職中の方が多数ご利用されています。面談や求人紹介はオンラインで実施するため、お仕事の合間にご相談いただけます。 |
| 3 | 登録から転職完了まで何日かかりますか？ | 平均3ヶ月ほどですが、最短2週間での転職成功事例もあります。ご希望のペースで進められます。 |
| 4 | どんな業界・職種に対応していますか？ | IT・メーカー・コンサル・金融など幅広い業界に対応。エンジニア・営業・マーケター・管理職などあらゆる職種の求人をご用意しています。 |

### CTA Section コピー（コンセプト別）

| コンセプト | 見出し（H2）| サブコピー | ボタンテキスト |
|---|---|---|---|
| A: CONNECTED | 「まず、話してみませんか。」 | キャリアの悩みを一人で抱え込まないでください。無料相談から始められます。 | 「無料で相談する」 |
| B: BOLD | 「今が、動くタイミングだ。」 | 理想のキャリアへの第一歩は、今すぐここから。登録は3分で完了します。 | 「今すぐ始める」 |
| C: HUMAN | 「一緒に、次のステップを考えよう。」 | 転職は一人でするものではありません。あなたのペースで、まず話すところから始めましょう。 | 「まずは話を聞いてみる」 |

---

## 3. コンセプト A: CONNECTED（モダン・プロフェッショナル）

### ブランドトーン
知性的・信頼感・つながり。LinkedInを洗練させたようなビジネスライクかつモダンな印象。

### カラーパレット

```css
/* globals.css — data-variant="A" */
:root[data-variant="A"] {
  /* Primary */
  --color-primary:        #4f46e5;   /* Indigo 600 */
  --color-primary-light:  #818cf8;   /* Indigo 400 */
  --color-primary-dark:   #3730a3;   /* Indigo 800 */

  /* Background */
  --color-bg:             #ffffff;
  --color-bg-subtle:      #f8fafc;   /* Slate 50 */
  --color-bg-muted:       #f1f5f9;   /* Slate 100 */

  /* Text */
  --color-text:           #0f172a;   /* Slate 900 */
  --color-text-muted:     #64748b;   /* Slate 500 */

  /* Accent */
  --color-accent:         #06b6d4;   /* Cyan 500 */

  /* Border */
  --color-border:         #e2e8f0;   /* Slate 200 */
}
```

### タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|---|---|---|---|
| H1 (Hero) | Inter | clamp(2.5rem, 5vw, 4rem) | 800 |
| H2 (Section) | Inter | clamp(1.75rem, 3vw, 2.5rem) | 700 |
| H3 (Card) | Inter | 1.25rem | 600 |
| Body | Inter | 1rem | 400 |
| Caption | Inter | 0.875rem | 400 |

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
```

### 3D 演出仕様 — Particle Network

**概念**: 無数の点（ノード）が線でつながり、ゆっくり動く。「人と企業のつながり」を視覚化。

```
設定値:
  particle count:  120
  particle color:  #818cf8 (Indigo 400), 透過度 0.6
  line color:      #4f46e5 (Indigo 600), 透過度 0.15
  line distance:   150px
  speed:           0.3 (ゆっくり)
  canvas size:     100vw × 100vh (Hero 背景)
  depth:           z軸 -200 〜 200 の3D空間

Three.js 実装:
  - BufferGeometry + Points でパーティクル描画
  - フレームごとに線を再計算 (distance-based)
  - カメラ: PerspectiveCamera, fov=60, マウス追従で微小回転
```

**モバイル (< 768px)**: 3D 無効。`background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)` の静的グラデーションに切り替え。

### ローディング状態

```tsx
// HeroA のフォールバック (Suspense)
<div className="h-screen bg-gradient-to-br from-indigo-600 to-cyan-500 animate-pulse" />
```

### レスポンシブ方針

| ブレークポイント | ナビゲーション | Hero レイアウト |
|---|---|---|
| < 768px (mobile) | ハンバーガーメニュー (Sheet コンポーネント) | 1カラム、3D 無効 |
| 768px〜 (tablet) | フルナビ、一部項目省略 | 1カラム、3D 有効 |
| 1024px〜 (desktop) | フルナビ | 2カラム (テキスト左、Canvas 右) |

---

## 4. コンセプト B: BOLD（ダーク・インパクト）

### ブランドトーン
先端技術・プレミアム・挑戦的。ハイクラス転職・スタートアップ層に訴求するダークモードデザイン。

### カラーパレット

```css
:root[data-variant="B"] {
  /* Primary */
  --color-primary:        #a855f7;   /* Purple 500 */
  --color-primary-light:  #d8b4fe;   /* Purple 300 */
  --color-primary-dark:   #7c3aed;   /* Violet 600 */

  /* Background */
  --color-bg:             #09090b;   /* Zinc 950 */
  --color-bg-subtle:      #18181b;   /* Zinc 900 */
  --color-bg-muted:       #27272a;   /* Zinc 800 */

  /* Text */
  --color-text:           #fafafa;   /* Zinc 50 */
  --color-text-muted:     #a1a1aa;   /* Zinc 400 */

  /* Accent */
  --color-accent:         #ec4899;   /* Pink 500 */

  /* Border */
  --color-border:         #3f3f46;   /* Zinc 700 */
}
```

### タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|---|---|---|---|
| H1 (Hero) | Geist | clamp(3rem, 6vw, 5rem) | 900 |
| H2 (Section) | Geist | clamp(2rem, 3.5vw, 3rem) | 700 |
| H3 (Card) | Geist | 1.375rem | 600 |
| Body | Geist | 1rem | 400 |
| Caption | Geist | 0.875rem | 400 |

```typescript
import { GeistSans } from 'geist/font/sans'
```

### 3D 演出仕様 — Wireframe Icosahedron

**概念**: 暗闇に浮かぶワイヤーフレームの正二十面体が低速回転。シンプルで強い印象。

```
設定値:
  geometry:        IcosahedronGeometry(2, 1)
  material:        MeshBasicMaterial, wireframe: true
  edge color:      linear gradient #a855f7 → #ec4899 (ShaderMaterial)
  rotation speed:  x: 0.002, y: 0.003 per frame
  position:        画面右寄り (x: 1.5)
  scale:           desktop: 1.0 / tablet: 0.8
  bloom effect:    UnrealBloomPass, strength: 0.5 (ポストプロセス)
```

**モバイル (< 768px)**: 3D 無効。代替として CSS のみで `box-shadow` グロー効果を持つ静的な正二十面体 SVG を表示。

### ローディング状態

```tsx
// HeroB のフォールバック
<div className="h-screen bg-zinc-950 flex items-center justify-center">
  <div className="w-32 h-32 border border-purple-500/30 rotate-45 animate-pulse" />
</div>
```

### レスポンシブ方針

| ブレークポイント | ナビゲーション | Hero レイアウト |
|---|---|---|
| < 768px | ハンバーガー (ドロワー、暗色背景) | 1カラム中央寄せ、3D 無効→SVG |
| 768px〜 | フルナビ (透過背景 + blur) | 1カラム、3D 有効 (canvas: 40vw) |
| 1024px〜 | フルナビ | テキスト左 + Canvas 右、画面全高 |

---

## 5. コンセプト C: HUMAN（温かみ・人中心）

### ブランドトーン
親しみやすさ・安心感・寄り添い。転職に不安を感じるユーザーに「一緒に考えてくれる」印象を与える。アクセシビリティを最重視。

### カラーパレット

```css
:root[data-variant="C"] {
  /* Primary */
  --color-primary:        #d97706;   /* Amber 600 */
  --color-primary-light:  #fbbf24;   /* Amber 400 */
  --color-primary-dark:   #b45309;   /* Amber 700 */

  /* Background */
  --color-bg:             #fffbf5;   /* Warm white */
  --color-bg-subtle:      #fef3c7;   /* Amber 100 */
  --color-bg-muted:       #fde68a;   /* Amber 200 */

  /* Text */
  --color-text:           #1c1917;   /* Stone 900 */
  --color-text-muted:     #78716c;   /* Stone 500 */

  /* Accent */
  --color-accent:         #f43f5e;   /* Rose 500 */

  /* Border */
  --color-border:         #e7e5e4;   /* Stone 200 */
}
```

### タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|---|---|---|---|
| H1 (Hero) | Plus Jakarta Sans | clamp(2.25rem, 4.5vw, 3.5rem) | 800 |
| H2 (Section) | Plus Jakarta Sans | clamp(1.5rem, 2.5vw, 2.25rem) | 700 |
| H3 (Card) | Plus Jakarta Sans | 1.25rem | 600 |
| Body | Plus Jakarta Sans | 1rem | 400 |
| Caption | Plus Jakarta Sans | 0.875rem | 400 |

```typescript
import { Plus_Jakarta_Sans } from 'next/font/google'
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })
```

### 3D 演出仕様 — Floating Spheres

**概念**: 暖色系の半透明な球体が複数、ゆっくりと上下に浮遊。柔らかく有機的な雰囲気。

```
設定値:
  sphere count:    5 (サイズ各 0.3〜1.2)
  material:        MeshPhongMaterial
  colors:          [#fbbf24, #f59e0b, #f43f5e, #fb923c, #fcd34d]
  opacity:         0.7〜0.9
  animation:       sin波による上下浮遊 (各球体で位相ずらし)
  float range:     ±0.5 units
  rotation:        ゆっくり自転 (y: 0.005/frame)
  lights:          AmbientLight(warm white) + PointLight(amber)
  position:        背景全体に分散
```

**モバイル (< 768px)**: 3D 無効。CSS `@keyframes float` による純 CSS アニメーション（`border-radius` を変形させた有機的な形状）に切り替え。WebGL 不使用。

### ローディング状態

```tsx
// HeroC のフォールバック
<div className="h-screen bg-[#fffbf5] flex items-center justify-center">
  <div className="w-16 h-16 rounded-full bg-amber-400/40 animate-ping" />
</div>
```

### レスポンシブ方針

| ブレークポイント | ナビゲーション | Hero レイアウト |
|---|---|---|
| < 768px | ハンバーガー (暖色ドロワー) | 1カラム中央寄せ、CSS アニメーション |
| 768px〜 | フルナビ | 1カラム、3D 有効 |
| 1024px〜 | フルナビ | 2カラム、テキスト左 + Canvas 背景 |

---

## 6. 共通デザイン仕様

### 6.1 スペーシングシステム（Tailwind デフォルト準拠）

| トークン名 | 値 | 用途 |
|---|---|---|
| `section-y` | `py-20` (80px) | セクション上下余白 |
| `container` | `max-w-6xl mx-auto px-4` | コンテンツ幅制限 |
| `card-gap` | `gap-8` | カードグリッド間隔 |
| `hero-min-h` | `min-h-screen` | ヒーロー最小高さ |

### 6.2 アニメーション仕様

| 要素 | ライブラリ | 設定 |
|---|---|---|
| ページ遷移 | Framer Motion | `initial: { opacity: 0, y: 20 }` → `animate: { opacity: 1, y: 0 }`, duration: 0.4s, ease: easeOut |
| スクロール表示 | Framer Motion `whileInView` | `once: true`, `amount: 0.2` |
| ボタン hover | Framer Motion `whileHover` | `scale: 1.02`, duration: 0.15s |
| フォーム送信中 | Framer Motion | ボタン内スピナー (`animate: { rotate: 360 }`, repeat: Infinity) |
| カード hover | CSS Tailwind | `transition-shadow duration-200 hover:shadow-lg` |

**アニメーション削減モード**: `prefers-reduced-motion: reduce` を検知したら全アニメーションを無効化。

```typescript
// lib/utils.ts に追加
export const motionConfig = {
  transition: { duration: 0.4, ease: 'easeOut' },
} satisfies MotionProps
```

### 6.3 ローディング・エラー・空状態

| 状態 | 実装 |
|---|---|
| 3D Canvas ロード中 | コンセプト別フォールバック (§3〜§5 参照) |
| フォーム送信中 | ボタンを disabled + スピナー表示 |
| フォームフィールドエラー | インライン赤テキスト + フィールドボーダー赤 (`aria-invalid`) |
| Server Action 失敗 | フォーム上部にエラーバナー (`role="alert"`) |
| 404 | コンセプトカラーに合わせたイラスト + ホームへの誘導 |
| 500 | シンプルなエラー文 + 問い合わせリンク |

### 6.4 アクセシビリティ要件（WCAG 2.1 AA 準拠）

| 要件 | 基準 | 実装方針 |
|---|---|---|
| カラーコントラスト | 4.5:1 以上 (通常テキスト) / 3:1 以上 (大テキスト) | shadcn/ui デフォルト + カスタムトークンで検証 |
| キーボード操作 | 全インタラクティブ要素がキーボードで操作可能 | shadcn/ui (Radix UI) が対応済み |
| フォーカスインジケータ | 視認性のある focus ring | Tailwind `focus-visible:ring-2` |
| スクリーンリーダー | ランドマーク・alt テキスト・aria ラベル | `<header>`, `<main>`, `<footer>`, `aria-label` |
| 3D Canvas | 装飾用途として `aria-hidden="true"` + `role="presentation"` を付与 | Three.js Canvas に適用 |
| フォームエラー | エラーメッセージと対応フィールドの関連付け | `aria-describedby` |
| アニメーション無効化 | `prefers-reduced-motion` 対応 | Framer Motion の `useReducedMotion()` |

**コントラスト確認ツール**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)  
**デプロイ前チェック**: Lighthouse Accessibility スコア ≥ 90

### 6.5 NavBar スクロール挙動（全コンセプト共通）

ページ最上部では Header を透過させ、スクロール開始後に背景色 + blur を付与してコンテンツと分離する。

```typescript
// components/layout/Header.tsx
'use client'
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
        scrolled
          ? 'bg-[--color-bg]/80 backdrop-blur-md border-b border-[--color-border]'
          : 'bg-transparent',
      )}
    >
      {/* ... */}
    </header>
  )
}
```

| 状態 | 背景 | border |
|---|---|---|
| スクロール前 (scrollY ≤ 40px) | `bg-transparent` | なし |
| スクロール後 (scrollY > 40px) | `bg-[--color-bg]/80 backdrop-blur-md` | `border-b border-[--color-border]` |

> `passive: true` でスクロールパフォーマンスを確保。`prefers-reduced-motion` 検知時は `transition-colors` を無効化すること。

### 6.6 Services タブ切り替え仕様

Services セクションに「転職希望者向け」「採用企業向け」のタブを設ける。shadcn/ui の `Tabs` コンポーネント（Radix UI）を使用。

```tsx
// components/sections/Services.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function Services() {
  return (
    <section className="section-y">
      <Tabs defaultValue="jobseeker">
        <TabsList className="mb-8">
          <TabsTrigger value="jobseeker">転職希望者の方</TabsTrigger>
          <TabsTrigger value="employer">採用企業の方</TabsTrigger>
        </TabsList>
        <TabsContent value="jobseeker">
          {/* サービス 3項目（転職希望者向け） */}
        </TabsContent>
        <TabsContent value="employer">
          {/* サービス 3項目（採用企業向け） */}
        </TabsContent>
      </Tabs>
    </section>
  )
}
```

- デフォルトは `jobseeker` タブ（転職希望者が主なターゲット）
- Radix `Tabs` はキーボード操作（Arrow キー）・スクリーンリーダー対応済み

**Framer Motion との組み合わせ注意点**: Radix の `TabsContent` に Framer Motion の props は直接渡せない。`asChild` を使って `motion.div` に委譲する。

```tsx
// ❌ 動かない（Radix コンポーネントは Framer Motion props を受け取らない）
<TabsContent value="jobseeker" initial={{ opacity: 0 }}>

// ✅ 正しい（asChild で motion.div に委譲する）
<TabsContent value="jobseeker" asChild>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
  >
    {/* コンテンツ */}
  </motion.div>
</TabsContent>
```

### 6.7 FAQ アコーディオン仕様

shadcn/ui の `Accordion` コンポーネント（Radix UI）を使用。

```tsx
// components/sections/FAQSection.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  { q: '利用は本当に無料ですか？', a: '転職希望者の方は...' },
  // § 2 FAQ 4件 参照
]

export function FAQSection() {
  return (
    <section className="section-y">
      <h2>よくある質問</h2>
      <Accordion type="single" collapsible className="mt-8 max-w-2xl mx-auto">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

- `type="single" collapsible`: 1つのみ展開、クリックで閉じられる
- Radix `Accordion` はキーボード操作（Enter/Space で開閉、Arrow キーで移動）・スクリーンリーダー対応済み
- 展開アニメーションは shadcn/ui デフォルト（`data-[state=open]` CSS）を使用。`prefers-reduced-motion` 対応も内包済み

---

## 7. A/B テスト実装設計

### 7.1 バリアント割り当てフロー

```
初回アクセス
     │
     ▼
src/proxy.ts（Next.js 新ファイル規約。旧 middleware.ts に相当）
  バリアント Cookie なし？
         │ Yes
         ▼
       ?__variant=X クエリあり？
         │ Yes → Cookie に強制セット（QA 用、maxAge: 30日）
         │ No  → ACTIVE_VARIANTS からランダム割り当て（現在: A / C 50%ずつ）
         │       Cookie: variant=A|C, maxAge: 30日, httpOnly
         ▼
RSC app/layout.tsx
  cookies().get('variant')?.value ?? 'A'
  → <html data-variant="A|B|C">

RSC app/(marketing)/page.tsx
  cookies().get('variant')?.value ?? 'A'
  → variantConfig[variant] を取得
  → 対応する Hero コンポーネントをレンダリング
```

### 7.2 ファイル構成（A/B テスト対応）

```
src/
├── proxy.ts                             # バリアント Cookie 割り当て（Next.js 新ファイル規約。旧 middleware.ts）
│
├── lib/
│   └── variants/
│       ├── types.ts                     # Variant 型（RSC / Server Action 用。DB enum から派生）
│       └── config.ts                    # バリアントごとの設定値（VariantConfig 型）
│
└── components/
    ├── sections/
    │   └── hero/
    │       ├── HeroA.tsx                # Particle Network
    │       ├── HeroB.tsx                # Wireframe Icosahedron
    │       └── HeroC.tsx                # Floating Spheres
    └── canvas/
        ├── ParticleNetwork.tsx          # Concept A 専用
        ├── WireframeIcosahedron.tsx     # Concept B 専用
        └── FloatingSpheres.tsx          # Concept C 専用
```

> **proxy.ts と types.ts の Next.js 16 の proxy.ts は Node.js runtime で動作するため、@/lib/db/schema から AbVariant 型を直接インポートして使用する。これにより型定義の二重管理を回避する。

### 7.3 実装パターン

```typescript
// src/proxy.ts（Next.js 新ファイル規約。旧 middleware.ts に相当）

import type { AbVariant as Variant } from '@/lib/db/schema'
const VARIANTS: Variant[] = ['A', 'B', 'C']

export function proxy(request: NextRequest) {
  const res = NextResponse.next()

  // QA 用: ?__variant=A で強制表示（Cookie を上書き）
  const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
  if (forced && (VARIANTS as string[]).includes(forced)) {
    res.cookies.set('variant', forced, { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/' })
    return res
  }

  // 初回アクセス時のみランダム割り当て
  if (!request.cookies.get('variant')) {
    const ACTIVE_VARIANTS: Variant[] = ['A', 'C']  // Phase 2 で ['A', 'B', 'C'] に変更
    const v = ACTIVE_VARIANTS[Math.floor(Math.random() * ACTIVE_VARIANTS.length)]
    res.cookies.set('variant', v, { maxAge: 60 * 60 * 24 * 30, httpOnly: true, path: '/' })
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}

// lib/variants/types.ts（RSC / Server Action 用）
// pgEnum を source of truth にし、Variant 型を派生させる
import { abVariantEnum } from '@/lib/db/schema'
export const VARIANTS = abVariantEnum.enumValues  // ['A', 'B', 'C']
export type Variant = (typeof VARIANTS)[number]

// lib/variants/config.ts（実際のフィールドは以下の通り）
export type VariantConfig = {
  show3D: boolean
  font: string
  heroHeadline: string
  heroSubcopy: string
  primaryCta: string
  secondaryCta: string
  ctaHeadline: string
  ctaSubcopy: string
  mobileGradient: string  // モバイル時の 3D 代替グラデーション
}

// app/(marketing)/page.tsx（RSC）
export default async function LandingPage() {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const config = variantConfig[variant]
  return (
    <>
      {variant === 'A' && <HeroA config={config} />}
      {variant === 'B' && <HeroB config={config} />}
      {variant === 'C' && <HeroC config={config} />}
      {/* 共通セクション */}
    </>
  )
}

// app/layout.tsx
export default async function RootLayout({ children }) {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  return <html lang="ja" data-variant={variant}>...</html>
}
```

### 7.4 コンバージョン計測

フォーム送信時にバリアントを記録（→ DB設計書の `contact_submissions.variant` カラム参照）。

**評価指標:**
- コンバージョン率 = バリアント別の投稿件数 / セッション数（将来: page_views テーブル追加）
- 判定: 最低4週間 / バリアントあたり30件の投稿で統計的有意性を確認

**勝者決定後**: `proxy.ts` の `ACTIVE_VARIANTS` を勝者1バリアントに固定し、負けたバリアントのコードは削除する。

### 7.5 バリアント強制確認（開発・QA）

```
?__variant=A  →  特定バリアントを強制表示（proxy.ts 実装済み）
?__variant=B
?__variant=C
```

Cookie が上書きされるため、以降のアクセスでも強制バリアントが維持される（maxAge: 30日）。

### 7.6 A/B テスト MVP プラン（現在: Phase 1 実施中）

| フェーズ | バリアント | 状態 |
|---|---|---|
| Phase 1（4〜8週間） | A: CONNECTED vs C: HUMAN | **実施中**（proxy.ts の ACTIVE_VARIANTS = ['A', 'C']） |
| Phase 2（勝者確定後） | 勝者 vs B: BOLD | 未着手 |

**Phase 2 への切り替え方法**: `src/proxy.ts` の `ACTIVE_VARIANTS` を `['A', 'B', 'C']` に変更するだけ。

**計測変数一覧** (Phase 1):
| 変数 | A | C |
|---|---|---|
| デザイントーン | モダン・プロフェッショナル | 温かみ・人中心 |
| カラースキーム | Indigo / ライトモード | Amber / ウォームホワイト |
| Primary CTA | 「無料で相談する」 | 「まずは話を聞いてみる」 |
| 3D 演出 | Particle Network（つながり） | Floating Spheres（有機的） |
| フォント | Inter | Plus Jakarta Sans |

---

## 8. タイポグラフィ詳細仕様（AI 実装制約）

> このセクションは AI への実装指示として機能する。§3〜§5 のサイズ・ウェイト表と合わせて読むこと。
> 「どう見えるか」という視覚的意図を明示することで、AIが適切な CSS 値を選べるようにする。

### 8.1 全プロパティ一覧（コンセプト共通）

| 役割 | size | weight | line-height | letter-spacing | max-width |
|---|---|---|---|---|---|
| Hero H1 | §3〜§5 参照 | §3〜§5 参照 | `1.1` | `0.02em` | `14em`（約14文字で折り返す） |
| Section H2 | §3〜§5 参照 | §3〜§5 参照 | `1.2` | `0.02em` | `20em` |
| Card H3 | `1.25rem` | `600` | `1.3` | `0.01em` | 制限なし |
| Body | `1rem` | `400` | `1.75` | `0.05em` | `42ch`（日本語で約30〜35文字） |
| Caption | `0.875rem` | `400` | `1.6` | `0.05em` | 制限なし |
| Button | `0.9375rem` | `600` | `1` | `0.02em` | 制限なし |

> **letter-spacing の考え方**: このプロジェクトの見出しフォント（Inter / Geist / Plus Jakarta Sans）は欧文フォントで、日本語は OS フォールバック（Hiragino / Meiryo）で描画される。CSS の `letter-spacing` は両者に同じ値が適用されるため、欧文の「大サイズで詰める」ルールを適用すると日本語部分が詰まりすぎる。日本語テキストが主体の場合は `0` または正値が正しい。欧文のみの要素（ロゴ・全角英数字なし）は別途 `-0.02em` を指定してよい。

**視覚的意図（なぜこの値か）**:

- **Hero H1 の line-height: 1.1** — 見出しを「塊」として視覚的にまとめる。1.4 以上だと行間が間延びして迫力が失われる
- **Hero H1 の letter-spacing: 0.02em** — 日本語全角文字の字間を微開きにして可読性を上げる。W3C JLREQ 推奨
- **Hero H1 の max-width: 14em** — 日本語 H1 は 1 行あたり 10〜14 文字が理想。それ以上はスキャンが難しくなる
- **Body の max-width: 42ch** — `ch` 単位は欧文フォントの "0" 幅基準。Inter / Geist 使用時は 1ch ≒ 0.6em のため、42ch ≒ 約 672px ≒ 日本語 30〜35 文字相当。JLREQ 推奨の 30〜40 文字に収まる
- **Body の line-height: 1.75** — 日本語本文は欧文より行間を広く取る。W3C JLREQ が 1.5〜1.6 以上を推奨。1.5 以下だと窮屈に見える

### 8.2 フォントウェイトの使い方

| weight | Tailwind クラス | 視覚的役割 | 使う場面 |
|---|---|---|---|
| 400 | `font-normal` | 通常の文章の太さ | Body、Caption、説明文 |
| 500 | `font-medium` | やや強調。太く「見えない」 | UI ラベル、ナビリンク |
| 600 | `font-semibold` | 明確に太い。見出し感が出る | Card H3、ボタン、タブ |
| 700 | `font-bold` | 強い強調。セクションの軸になる | Section H2 |
| 800 | `font-extrabold` | 最大の視覚的インパクト | Hero H1（コンセプト A・C）|
| 900 | `font-black` | 黒板に書いたような圧力感 | Hero H1（コンセプト B のみ）|

**禁止パターン**:
- Body テキストに `font-bold` (700) 以上を使わない。部分強調は `font-semibold` (600) まで
- H1 に `font-bold` (700) を使わない。800 か 900 を使うこと（スケールの意味を保つ）
- ボタンラベルに `font-normal` を使わない（クリッカブルに見えない）

### 8.3 日本語テキスト固有のルール

```css
/* 日本語見出しに必ず適用する */
.heading-ja {
  text-wrap: balance;        /* 途中で不自然に折り返すのを防ぐ */
  word-break: keep-all;      /* 単語の途中で改行させない */
  overflow-wrap: break-word; /* 折り返せない長い語だけ許可 */
}

/* 本文 */
.body-ja {
  text-wrap: pretty;  /* 最終行が短くなりすぎるのを防ぐ */
  hanging-punctuation: allow-end; /* 句読点のぶら下がり */
}
```

**禁止パターン**:
- 見出しに `text-wrap: wrap`（デフォルト）を使わない。必ず `balance` を指定する
- `white-space: nowrap` を H1/H2 に使わない（モバイルでオーバーフローする）
- 日本語テキストを含む要素に `letter-spacing` の負値を設定しない（全角文字が詰まりすぎる）
- `font-style: italic` を日本語テキストに使わない（日本語フォントに italic バリアントがないため OS が擬似斜体を生成し汚い。強調には `font-weight` を使う）

### 8.4 レスポンシブ時の文字サイズ制約

`clamp()` を使う場合の境界値チェック:

| コンセプト | H1 最小値（モバイル） | H1 最大値（デスクトップ） | 目安（相対感） |
|---|---|---|---|
| A: CONNECTED | `2.5rem` (40px) | `4rem` (64px) | Body (16px) の 2.5〜4倍 |
| B: BOLD | `3rem` (48px) | `5rem` (80px) | Body の 3〜5倍（インパクト重視）|
| C: HUMAN | `2.25rem` (36px) | `3.5rem` (56px) | Body の 2.25〜3.5倍（親しみやすさ）|

**モバイル（< 768px）での追加制約**:
- H1 が 2 行以内に収まるか確認する（3 行以上になる場合は `clamp()` の最小値を下げる）
- Section H2 は `clamp(1.375rem, 4vw, ...)` で 22px 以上を確保する（それ以下は Body と区別がつかなくなる）

### 8.5 CSS カスタムプロパティ（`@theme` 実装例）

```css
/* app/globals.css — タイポグラフィトークン */
@theme {
  /* line-height */
  --leading-hero:    1.1;
  --leading-heading: 1.2;
  --leading-body:    1.75;

  /* letter-spacing（日本語テキスト対応: 正値または0のみ） */
  --tracking-hero:    0.02em;
  --tracking-heading: 0.02em;
  --tracking-body:    0.05em;  /* W3C JLREQ 推奨 */

  /* max-width（テキスト行長制限） */
  --measure-hero:  14em;   /* Hero H1: 10〜14文字で折り返す */
  --measure-prose: 42ch;   /* Body: Inter使用時 ≒ 日本語30〜35文字 */
  --measure-h2:    20em;   /* Section H2 */
}
```

> AI への指示: タイポグラフィ値を変更するときは、このトークンを変更する。コンポーネント内に `line-height: 1.1` などをハードコードしない。

### 8.6 実装チェックリスト（コンポーネント作成時）

AIが新しいコンポーネントを作るたびに以下を確認すること:

- [ ] H1/H2 に `text-wrap: balance` が付いているか
- [ ] H1 の `max-width` が `14em` 以下になっているか
- [ ] Body テキストの `max-width` が `42ch` 以下になっているか
- [ ] `line-height` が §8.1 の値になっているか（Body は 1.75 以上）
- [ ] 日本語テキストに `letter-spacing` の負値が使われていないか
- [ ] `font-style: italic` が日本語テキストに使われていないか
- [ ] フォントウェイトが §8.2 の役割に対応しているか（100〜300 は日本語に使わない）
- [ ] `font-size` が `px` ではなく `rem` で指定されているか
- [ ] モバイル（< 768px）で H1 が 2 行以内に収まるか
- [ ] Caption / 小テキストが `0.75rem`（12px）以上になっているか

### 8.7 フォントファミリー・フォールバックスタック

next/font は `latin` サブセットのみをロードするため、日本語文字は OS のシステムフォントで描画される。フォールバックチェーンを明示しないと OS ごとに見た目が大きく変わる。

```css
/* app/globals.css — フォントファミリー定義 */
:root {
  --font-fallback-ja:
    "Hiragino Kaku Gothic Pro",  /* macOS 10.6+, iOS */
    "Hiragino Sans",             /* macOS 10.11+ */
    "Meiryo",                    /* Windows Vista+ */
    "MS PGothic",                /* Windows XP */
    "Noto Sans CJK JP",          /* Android / Linux */
    sans-serif;
}

body {
  font-family: var(--font-sans), var(--font-fallback-ja);
}
```

> AI への指示: フォントを指定する際は `var(--font-sans)` 単体で終わらせない。必ず `var(--font-fallback-ja)` を後続させる。

**OS 別の描画結果（参考）**:

| OS | 日本語フォント | 特徴 |
|---|---|---|
| macOS / iOS | Hiragino Kaku Gothic Pro | きれいで読みやすい。ウェイト 400/700 が自然 |
| Windows 11 | Meiryo | やや横長。ウェイト 400/700 |
| Android | Noto Sans CJK JP | Google 標準。バランスが良い |

**フォント関連の禁止パターン（まとめ）**:

| 禁止 | 理由 | 代替 |
|---|---|---|
| `font-style: italic` を日本語テキストに使う | italic バリアントなし → 擬似斜体（oblique）が生成されて汚い | 強調は `font-weight` の変化で行う |
| `font-weight: 100〜300` を日本語テキストに使う | 日本語フォントは 400 / 700 の 2 ウェイトのみ。細ウェイトは 400 で代替表示される | 最低 `font-weight: 400` を使う |
| `font-size` を `px` 固定で指定する（`html` タグ含む） | ブラウザのフォントサイズ設定（アクセシビリティ機能）を無視する | `rem` で指定する |
| テキストを `0.75rem`（12px）以下にする | 日本語の最小可読サイズは 12px。それ以下は視認不可 | Caption は `0.875rem`（14px）を最小とする |
| カスタム日本語フォントファイルをフルセットで配信する | 日本語フォントは 2MB+ になる。ページ表示が大幅に遅くなる | システムフォントフォールバックを使う |

---

## 9. 汎用デザインベストプラクティス（AI 実装制約）

> §8 が「このプロジェクト固有の仕様」であるのに対し、このセクションは「一般的な Web デザインの原則」を AI への指示として明文化したもの。Figma などのデザインツールを使わない場合でも、このセクションを守ることで視覚的な品質を担保する。

### 9.1 視覚的ヒエラルキー

- テキストは最大 3 レベルのヒエラルキーに留める（H1 → H2 → Body。それ以上は複雑になる）
- セクション内で「最も大きな要素」と「最も小さな要素」のサイズ比は 2:1 以上確保する
- 同一セクション内の Body テキストは全て同じ `font-size` にする（微妙に違うと不統一に見える）
- 強調は色・ウェイト・サイズのうち **1つだけ** 変える（複数同時変更は強調効果が弱まる）

### 9.2 スペーシングの原則

- **セクション間の余白 > カード間の余白 > テキスト間の余白** の大小関係を必ず守る
- 関連する要素は近づける。無関係な要素は離す（Gestalt の近接の法則）
- ページ内で使うスペーシング値は Tailwind のスケール（4の倍数: 4/8/12/16/24/32/48/64px）に限定する。`17px` などの端数値は使わない
- Hero セクションの上下パディングは他セクションの 1.5 倍以上にする

### 9.3 コントラストとカラー

- テキストと背景のコントラスト比は WCAG AA 基準（通常テキスト 4.5:1、大テキスト 3:1）を必ず満たす
- プライマリカラーはページ内で **1色のみ**。アクセントカラーは CTA ボタン・強調箇所に限定して使う
- グレーを複数使う場合は Tailwind のトーンスケール（200/300/400/500/600/700）から選ぶ。`#f2f2f2` などの端数 hex は使わない
- セクション背景に強い色を使う場合、前後のセクションとのコントラスト差を意識する（全セクション同背景色は単調になる）

### 9.4 ボタンデザイン

- Primary ボタンは 1 ページに最大 2 箇所。それ以上は Secondary か Ghost に格下げする
- ボタンの最小タップ領域は 44×44px（iOS HIG 推奨）
- ボタンラベルは動詞から始める（「無料で相談する」「登録する」。「詳細」「もっと見る」は避ける）
- hover 時は `opacity` 変化より `background-color` のトーン変化を使う（視認性が高い）
- disabled 状態は `opacity-50 cursor-not-allowed pointer-events-none` を組み合わせる

### 9.5 画像・メディア

- `<img>` には必ず `alt` を付ける。装飾画像は `alt=""`
- Hero 背景画像は `object-cover object-center` で表示崩れを防ぐ
- 画像の上にテキストを重ねる場合、コントラスト確保のため overlay（`bg-black/40` 程度）を必ず入れる
- `loading="lazy"` は `above the fold` の画像には使わない（LCP が悪化する）

### 9.6 レスポンシブレイアウト

- モバイルファースト: `sm:` `md:` `lg:` のブレークポイント修飾子を使う（デスクトップから縮めない）
- 1 カラム（モバイル） → 2〜3 カラム（デスクトップ）が基本パターン
- グリッドのカラム数をモバイルで 3 以上にしない（コンテンツが小さすぎる）
- フォントサイズはモバイルでも最低 `0.875rem` (14px) を確保する（それ以下は可読性が低い）
- コンテナの横パディングはモバイルで `px-4`（16px）以上確保する

### 9.7 フォームデザイン

- ラベルはフィールドの上部に配置する（プレースホルダーだけのフォームはアクセシビリティ上 NG）
- フィールドの幅は入力される内容の長さに合わせる（電話番号フィールドをフル幅にしない）
- エラーメッセージはフィールドの真下に赤で表示する（フォームの上部にまとめない）
- Submit ボタンは右寄せより中央寄せまたは左寄せの方がモバイルで押しやすい

### 9.8 インタラクション

- hover トランジションは `duration-150`〜`duration-200` が最も自然に見える（それ以上は重い）
- `transform` を使うアニメーションは `will-change: transform` を事前に付与する（ただし常用しない）
- ページ読み込み時のフェードインは `opacity: 0 → 1` を `duration-400` で行う。`duration-1000` 以上はユーザーを待たせる
- スクロールトリガーのアニメーションは `amount: 0.2`（要素の 20% が見えたら起動）が自然。`amount: 0.8` 以上は発動しないことがある
