'use client'

import dynamic from 'next/dynamic'

const ParticleNetwork = dynamic(() => import('@/components/canvas/ParticleNetwork'), { ssr: false })
const WireframeIcosahedron = dynamic(() => import('@/components/canvas/WireframeIcosahedron'), { ssr: false })
const FloatingSpheres = dynamic(() => import('@/components/canvas/FloatingSpheres'), { ssr: false })

export function OgCanvas({ variant }: { variant: string }) {
  if (variant === 'a') return <ParticleNetwork />
  if (variant === 'b') return <WireframeIcosahedron />
  if (variant === 'c') return <FloatingSpheres />
  return null
}
