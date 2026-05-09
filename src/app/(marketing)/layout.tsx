import { cookies } from 'next/headers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VariantSwitcher } from '@/components/dev/VariantSwitcher'
import type { Variant } from '@/lib/variants/types'
import { variantConfig } from '@/lib/variants/config'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const variant = ((await cookies()).get('variant')?.value ?? 'A') as Variant
  const { primaryCta } = variantConfig[variant]

  return (
    <>
      <Header primaryCta={primaryCta} />
      <main className="flex-1">{children}</main>
      <Footer />
      <VariantSwitcher currentVariant={variant} />
    </>
  )
}
