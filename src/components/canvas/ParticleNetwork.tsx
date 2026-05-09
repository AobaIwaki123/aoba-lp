'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const PALETTE = [
  new THREE.Color(0x4f46e5),
  new THREE.Color(0x06b6d4),
  new THREE.Color(0x818cf8),
  new THREE.Color(0x22d3ee),
  new THREE.Color(0x6366f1),
  new THREE.Color(0x0ea5e9),
  new THREE.Color(0x38bdf8),
]

function Particles() {
  const count = 300
  const linesRef = useRef<THREE.LineSegments>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const vel: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 400
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400
      const c = PALETTE[i % PALETTE.length]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
      ))
    }
    return [pos, col, vel]
  }, [])

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i].x
      pos[i * 3 + 1] += velocities[i].y
      pos[i * 3 + 2] += velocities[i].z
      if (Math.abs(pos[i * 3])     > 200) velocities[i].x *= -1
      if (Math.abs(pos[i * 3 + 1]) > 200) velocities[i].y *= -1
      if (Math.abs(pos[i * 3 + 2]) > 200) velocities[i].z *= -1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    const linePos: number[] = []
    const lineCol: number[] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i*3] - pos[j*3]
        const dy = pos[i*3+1] - pos[j*3+1]
        const dz = pos[i*3+2] - pos[j*3+2]
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < 70) {
          linePos.push(pos[i*3], pos[i*3+1], pos[i*3+2], pos[j*3], pos[j*3+1], pos[j*3+2])
          const a = (1 - dist / 70) * 0.18
          // blend colors of the two endpoints
          const ci = PALETTE[i % PALETTE.length]
          const cj = PALETTE[j % PALETTE.length]
          lineCol.push(ci.r, ci.g, ci.b, a, cj.r, cj.g, cj.b, a)
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
    lineGeometry.setAttribute('color',    new THREE.Float32BufferAttribute(lineCol, 4))
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={2.5} vertexColors transparent opacity={0.75} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent depthWrite={false} />
      </lineSegments>
    </group>
  )
}

export default function ParticleNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 150], fov: 60 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <Particles />
    </Canvas>
  )
}
