import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField({ count = 400 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80
      const y = (Math.random() - 0.5) * 80
      const z = (Math.random() - 0.5) * 80
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Color: mostly white, some blue/purple tints
      const colorRand = Math.random()
      if (colorRand < 0.15) {
        colors[i * 3] = 0.3; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 1.0
      } else if (colorRand < 0.25) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 1.0
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0
      }
    }
    return { positions, colors }
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime() * 0.015
    meshRef.current.rotation.y = t
    meshRef.current.rotation.x = t * 0.2
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
