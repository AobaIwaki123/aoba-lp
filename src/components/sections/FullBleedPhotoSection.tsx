export function FullBleedPhotoSection() {
  return (
    <section className="relative h-72 sm:h-96 flex items-center justify-center overflow-hidden">
      {/* placeholder — Phase 5 で実写に差し替え */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, var(--color-brand-dark) 0%, var(--color-brand) 100%)' }}
      />
      <p className="relative z-10 text-center text-white font-semibold text-lg px-4 max-w-2xl leading-relaxed drop-shadow">
        5,000社以上の企業と、50,000名以上の転職希望者が利用しています。
      </p>
    </section>
  )
}
