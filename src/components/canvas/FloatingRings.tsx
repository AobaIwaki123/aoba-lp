'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COLORS = [0x7c3aed, 0xec4899, 0xa855f7, 0xf0abfc, 0x9333ea, 0xdb2777, 0xc026d3, 0xd946ef]

function Rings() {
  const count = 9
  const rings = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      r:        Math.random() * 2.5 + 0.8,
      tube:     Math.random() * 0.055 + 0.022,
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 2,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      color:   COLORS[i % COLORS.length],
      rx:      (Math.random() - 0.5) * 0.007,
      ry:      (Math.random() - 0.5) * 0.007,
      rz:      (Math.random() - 0.5) * 0.005,
      opacity: Math.random() * 0.22 + 0.12,
    }))
  ), [])

  const refs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(() => {
    rings.forEach((ring, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.rotation.x += ring.rx
      mesh.rotation.y += ring.ry
      mesh.rotation.z += ring.rz
    })
  })

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el }}
          position={ring.position}
          rotation={ring.rotation}
        >
          <torusGeometry args={[ring.r, ring.tube, 16, 120]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  )
}

export default function FloatingRings() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <Rings />
    </Canvas>
  )
}
