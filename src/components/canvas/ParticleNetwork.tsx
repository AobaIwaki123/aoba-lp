'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Particles() {
  const count = 120
  const linesRef = useRef<THREE.LineSegments>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = []
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        )
      )
    }
    return [pos, vel]
  }, [])

  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    // Update positions
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i].x
      positions[i * 3 + 1] += velocities[i].y
      positions[i * 3 + 2] += velocities[i].z

      // Bounce off walls
      if (Math.abs(positions[i * 3]) > 200) velocities[i].x *= -1
      if (Math.abs(positions[i * 3 + 1]) > 200) velocities[i].y *= -1
      if (Math.abs(positions[i * 3 + 2]) > 200) velocities[i].z *= -1
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Update lines
    const linePositions = []
    const lineColors = []
    const color = new THREE.Color('#4f46e5')
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3]
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < 80) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          )
          const alpha = 1.0 - dist / 80
          lineColors.push(color.r, color.g, color.b, alpha * 0.15)
          lineColors.push(color.r, color.g, color.b, alpha * 0.15)
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4))
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={2} color="#818cf8" transparent opacity={0.6} sizeAttenuation />
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
