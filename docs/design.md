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
middleware.ts
  バリアントCookieなし？
     │ Yes
     ▼
  ランダム割り当て (A/B/C 各33%)
  Cookie: variant=A|B|C
  maxAge: 30日
     │
     ▼
RSC page.tsx
  cookies().get('variant') → 'A'
     │
     ▼
  <LandingPage variant="A" />
  <html data-variant="A">
```

### 7.2 ファイル構成（A/B テスト対応追加分）

```
src/
├── middleware.ts                        # バリアント Cookie 割り当て
│
├── lib/
│   └── variants/
│       ├── types.ts                     # export type Variant = 'A' | 'B' | 'C'
│       └── config.ts                    # バリアントごとの機能フラグ
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

### 7.3 実装パターン

```typescript
// lib/variants/types.ts
// pgEnum を唯一の source of truth にする。
// VARIANTS 配列はランタイムで使う値として pgEnum から直接取得し、
// Variant 型はその配列から派生させる（独立した string literal 定義は持たない）。
import { abVariantEnum } from '@/lib/db/schema'

export const VARIANTS = abVariantEnum.enumValues  // ['A', 'B', 'C']
export type Variant = typeof VARIANTS[number]

// lib/variants/config.ts
export const variantConfig: Record<Variant, {
  show3D: boolean
  font: string
  primaryCta: string
  ctaHeadline: string
}> = {
  A: { show3D: true, font: 'Inter',             primaryCta: '無料で相談する',      ctaHeadline: 'まず、話してみませんか。' },
  B: { show3D: true, font: 'Geist',             primaryCta: '今すぐ始める',        ctaHeadline: '今が、動くタイミングだ。' },
  C: { show3D: true, font: 'Plus Jakarta Sans', primaryCta: 'まずは話を聞いてみる', ctaHeadline: '一緒に、次のステップを考えよう。' },
}

// middleware.ts
export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  if (!request.cookies.get('variant')) {
    const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
    res.cookies.set('variant', v, { maxAge: 60 * 60 * 24 * 30, httpOnly: true })
  }
  return res
}

// app/(marketing)/page.tsx (RSC)
export default async function Page() {
  const variant = (await cookies()).get('variant')?.value as Variant ?? 'A'
  return <LandingPage variant={variant} />
}

// app/layout.tsx
export default async function RootLayout({ children }) {
  const variant = (await cookies()).get('variant')?.value ?? 'A'
  return <html lang="ja" data-variant={variant}>...</html>
}
```

### 7.4 コンバージョン計測

フォーム送信時にバリアントを記録（→ DB設計書の `contact_submissions.variant` カラム参照）。

**評価指標:**
- コンバージョン率 = バリアント別の投稿件数 / セッション数（将来: page_views テーブル追加）
- 判定: 最低4週間 / バリアントあたり30件の投稿で統計的有意性を確認

**勝者決定後**: middleware で1バリアントに固定し、負けたバリアントのコードは削除する。

### 7.5 Vercel ダッシュボードでのバリアント強制確認

```
?__variant=A  →  開発・QA 用に特定バリアントを強制表示（middleware で対応）
```

```typescript
// middleware.ts に追加
const forced = request.nextUrl.searchParams.get('__variant') as Variant | null
if (forced && VARIANTS.includes(forced)) {
  res.cookies.set('variant', forced, { maxAge: 60 * 60 })
}
```

### 7.6 A/B テスト MVP 推奨プラン（2バリアントから開始）

3バリアント同時実施はサンプル収集期間が3倍かかる。初回リリースは**A vs C の2バリアント**から始め、勝者確定後に B を加えた第2フェーズに移行することを推奨する。

| フェーズ | バリアント | 狙い |
|---|---|---|
| Phase 1（4〜8週間） | A: CONNECTED vs C: HUMAN | コントラストが最大（明度・トーン・3D表現すべて異なる）。「信頼×知性」vs「温かみ×寄り添い」の優劣を早期検証 |
| Phase 2（勝者確定後） | 勝者 vs B: BOLD | ダークモード・ハイクラス訴求の有効性を追加検証 |

**MVP 切り替え方法**: Phase 1 では `VARIANTS` を `['A', 'C']` に絞り、middleware の割り当てを50/50にする。

```typescript
// middleware.ts — Phase 1 設定
const ACTIVE_VARIANTS: Variant[] = ['A', 'C']  // Phase 2 で ['A', 'B', 'C'] に戻す
const v = ACTIVE_VARIANTS[Math.floor(Math.random() * ACTIVE_VARIANTS.length)]
```

**計測変数一覧** (Phase 1):
| 変数 | A | C |
|---|---|---|
| デザイントーン | モダン・プロフェッショナル | 温かみ・人中心 |
| カラースキーム | Indigo / ライトモード | Amber / ウォームホワイト |
| Primary CTA | 「無料で相談する」 | 「まずは話を聞いてみる」 |
| 3D 演出 | Particle Network（つながり） | Floating Spheres（有機的） |
| フォント | Inter | Plus Jakarta Sans |
