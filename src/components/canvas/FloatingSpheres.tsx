'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COLORS = ['#fbbf24', '#f59e0b', '#f43f5e', '#fb923c', '#fcd34d', '#f97316', '#fde68a']

function Spheres() {
  const groupRef = useRef<THREE.Group>(null)
  const count = 12

  const spheres = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      scale:  Math.random() * 1.6 + 0.4,
      color:  COLORS[i % COLORS.length],
      speed:  Math.random() * 0.45 + 0.3,
      offset: Math.random() * Math.PI * 2,
    }))
  ), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const s = spheres[i]
      child.position.y = s.position[1] + Math.sin(time * s.speed + s.offset) * 1.5
      child.rotation.y += 0.005
      child.rotation.x += 0.002
    })
  })

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} position={s.position} scale={s.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial
            color={s.color}
            transparent
            opacity={0.32}
            shininess={120}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function FloatingSpheres() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.5} color="#fffbf5" />
      <pointLight position={[10, 10, 10]}  intensity={1.8} color="#fbbf24" />
      <pointLight position={[-8, -5,  6]}  intensity={0.8} color="#f43f5e" />
      <Spheres />
    </Canvas>
  )
}
