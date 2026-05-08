'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Spheres() {
  const groupRef = useRef<THREE.Group>(null)
  const count = 7
  
  const spheres = useMemo(() => {
    const colors = ['#fbbf24', '#f59e0b', '#f43f5e', '#fb923c', '#fcd34d']
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 5
        ],
        scale: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.5 + 0.5,
        offset: Math.random() * Math.PI * 2
      })
    }
    return data
  }, [])

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
        <mesh key={i} position={s.position as [number, number, number]} scale={s.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhongMaterial 
            color={s.color} 
            transparent 
            opacity={0.8}
            shininess={100}
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
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" />
      <Spheres />
    </Canvas>
  )
}
