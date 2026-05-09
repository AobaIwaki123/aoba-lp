import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VariantSwitcher } from '@/components/dev/VariantSwitcher'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <VariantSwitcher />
    </>
  )
}
