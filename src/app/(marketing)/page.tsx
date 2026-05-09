import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import type { Variant } from '@/lib/variants/types'
import { variantConfig } from '@/lib/variants/config'
import { HeroA } from '@/components/sections/hero/HeroA'
import { HeroB } from '@/components/sections/hero/HeroB'
import { HeroC } from '@/components/sections/hero/HeroC'
import { StatsSection } from '@/components/sections/StatsSection'
import { LogoBarSection } from '@/components/sections/LogoBarSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { FullBleedPhotoSection } from '@/components/sections/FullBleedPhotoSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTASection } from '@/components/sections/CTASection'

export async function generateMetadata(): Promise<Metadata> {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const config = variantConfig[variant]
  const v = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'dev'

  return {
    title: config.heroHeadline,
    description: config.heroSubcopy.slice(0, 50) + '...',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: config.heroHeadline,
      description: config.heroSubcopy.slice(0, 50) + '...',
      url: '/',
      images: [{
        url: `/api/og?variant=${variant}&page=home&v=${v}`,
        width: 1200,
        height: 630,
        alt: config.heroHeadline,
      }],
    },
    twitter: {
      title: config.heroHeadline,
      description: config.heroSubcopy.slice(0, 50) + '...',
      images: [`/api/og?variant=${variant}&page=home&v=${v}`],
    },
  }
}

export default async function LandingPage() {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const config = variantConfig[variant]

  return (
    <>
      {variant === 'A' && <HeroA config={config} />}
      {variant === 'B' && <HeroB config={config} />}
      {variant === 'C' && <HeroC config={config} />}
      <StatsSection />
      <LogoBarSection />
      <ServicesSection />
      <FullBleedPhotoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection config={config} />
    </>
  )
}
