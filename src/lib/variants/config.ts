import type { Variant } from './types'

export type VariantConfig = {
  show3D: boolean
  font: string
  heroHeadline: string
  heroSubcopy: string
  primaryCta: string
  secondaryCta: string
  ctaHeadline: string
  ctaSubcopy: string
  mobileGradient: string
}

export const variantConfig: Record<Variant, VariantConfig> = {
  A: {
    show3D: true,
    font: 'Inter',
    heroHeadline: '人と企業の、最適な出会いを。',
    heroSubcopy:
      '5,000社以上の求人から、あなたのキャリアにぴったりの一社を見つけましょう。専任のキャリアアドバイザーが、転職活動を全面サポートします。',
    primaryCta: '無料で相談する',
    secondaryCta: '求人を探す',
    ctaHeadline: 'まず、話してみませんか。',
    ctaSubcopy:
      'キャリアの悩みを一人で抱え込まないでください。無料相談から始められます。',
    mobileGradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
  },
  B: {
    show3D: true,
    font: 'Geist',
    heroHeadline: '次のキャリアは、ここから始まる。',
    heroSubcopy:
      '業界トップクラスの求人データベースと、AIによるマッチングで、理想の職場との出会いを加速させます。',
    primaryCta: '今すぐ始める',
    secondaryCta: '求人を探す',
    ctaHeadline: '今が、動くタイミングだ。',
    ctaSubcopy:
      '理想のキャリアへの第一歩は、今すぐここから。登録は3分で完了します。',
    mobileGradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  },
  C: {
    show3D: true,
    font: 'Plus Jakarta Sans',
    heroHeadline: 'あなたの可能性を、一緒に広げよう。',
    heroSubcopy:
      '転職は人生の大きな決断。だからこそ、私たちは一人ひとりに寄り添い、あなたらしいキャリアを一緒に考えます。',
    primaryCta: 'まずは話を聞いてみる',
    secondaryCta: '求人を探す',
    ctaHeadline: '一緒に、次のステップを考えよう。',
    ctaSubcopy:
      '転職は一人でするものではありません。あなたのペースで、まず話すところから始めましょう。',
    mobileGradient: 'linear-gradient(135deg, #d97706 0%, #f43f5e 100%)',
  },
}
