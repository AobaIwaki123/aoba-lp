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
