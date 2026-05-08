'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]} scale={1.5}>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial color="#a855f7" wireframe />
    </mesh>
  )
}

export default function WireframeIcosahedron() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <Icosahedron />
    </Canvas>
  )
}
