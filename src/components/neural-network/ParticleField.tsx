import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField({ count = 400 }: { count?: number }) {
  const ref1 = useRef<THREE.Points>(null)
  const ref2 = useRef<THREE.Points>(null)
  const ref3 = useRef<THREE.Points>(null)

  const layers = useMemo(() => {
    const counts = [
      Math.floor(count * 0.15), // Layer 1 (Large nebula core)
      Math.floor(count * 0.35), // Layer 2 (Medium stars)
      Math.floor(count * 0.50), // Layer 3 (Tiny dust)
    ]

    return counts.map((layerCount, layerIdx) => {
      const positions = new Float32Array(layerCount * 3)
      const colors = new Float32Array(layerCount * 3)

      for (let i = 0; i < layerCount; i++) {
        const x = (Math.random() - 0.5) * 75
        const y = (Math.random() - 0.5) * 75
        const z = (Math.random() - 0.5) * 75
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z

        if (layerIdx === 0) {
          // Neon Cyan / Purple Magenta
          if (Math.random() < 0.5) {
            colors[i * 3] = 0.15; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1.0 // Cyan
          } else {
            colors[i * 3] = 0.65; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.85 // Magenta-violet
          }
        } else if (layerIdx === 1) {
          // Soft Indigo / Light Blue
          if (Math.random() < 0.6) {
            colors[i * 3] = 0.35; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 1.0
          } else {
            colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.98
          }
        } else {
          // Faint white dust
          const brightness = 0.65 + Math.random() * 0.35
          colors[i * 3] = brightness
          colors[i * 3 + 1] = brightness
          colors[i * 3 + 2] = brightness
        }
      }

      return { positions, colors }
    })
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Layer 1: Slow galactic drift
    if (ref1.current) {
      ref1.current.rotation.y = t * 0.005
      ref1.current.rotation.x = t * 0.002
    }
    // Layer 2: Medium speed counter-rotation
    if (ref2.current) {
      ref2.current.rotation.y = -t * 0.012
      ref2.current.rotation.z = t * 0.006
    }
    // Layer 3: Rapid dust sway
    if (ref3.current) {
      ref3.current.rotation.y = t * 0.02
      ref3.current.position.y = Math.sin(t * 0.4) * 0.4
    }
  })

  return (
    <group>
      {/* Layer 1: Nebula Core (Large, soft glow) */}
      <points ref={ref1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers[0].positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[layers[0].colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Layer 2: Medium Stars */}
      <points ref={ref2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers[1].positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[layers[1].colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Layer 3: Faint Tiny Dust */}
      <points ref={ref3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers[2].positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[layers[2].colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
