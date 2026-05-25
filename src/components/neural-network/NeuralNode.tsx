import { useRef, useState, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { GraphNode3D } from '../../types/knowledge'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#3b82f6',
  architecture: '#8b5cf6',
  devops: '#10b981',
  career: '#f59e0b',
  tools: '#ef4444',
}

const DIFFICULTY_SCALE: Record<string, number> = {
  beginner: 0.35,
  intermediate: 0.5,
  advanced: 0.65,
}

interface NeuralNodeProps {
  node: GraphNode3D
  onHover: (node: GraphNode3D | null) => void
  onClick: (node: GraphNode3D) => void
  connectionCount?: number
}

function generateDendrites(count: number, seed: number) {
  const dendrites: { dir: THREE.Vector3; length: number; rotAxis: THREE.Vector3; rotAngle: number }[] = []
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(2 * ((seed * 9301 + i * 49297) % 1000) / 1000 - 1)
    const theta = ((seed * 49297 + i * 2311) % 1000) / 1000 * Math.PI * 2
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    )
    const length = 0.3 + ((seed * 2311 + i * 7127) % 1000) / 1000 * 0.5
    const rotAxis = new THREE.Vector3(0, 1, 0).cross(dir).normalize()
    const rotAngle = Math.PI / 2
    dendrites.push({ dir, length, rotAxis, rotAngle })
  }
  return dendrites
}

export function NeuralNode({ node, onHover, onClick, connectionCount = 0 }: NeuralNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scale = DIFFICULTY_SCALE[node.difficulty] ?? 0.5
  const color = CATEGORY_COLORS[node.category] ?? '#666'
  const targetScale = useRef(scale)

  const dendriteCount = 3 + Math.floor(((node.position[0] * 7 + node.position[1] * 13) % 1 + 1) % 1 * 4)
  const seed = Math.abs(node.position[0] * 1000 + node.position[1] * 100 + node.position[2] * 10) | 0
  const dendrites = useMemo(() => generateDendrites(dendriteCount, seed), [dendriteCount, seed])

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return
    const t = clock.getElapsedTime()

    const pulse = 1 + Math.sin(t * 2 + node.position[0]) * 0.05
    targetScale.current = scale * pulse * (hovered ? 1.3 : 1)

    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale.current, targetScale.current, targetScale.current),
      0.1
    )

    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = hovered ? 0.8 : 0.3 + Math.sin(t * 1.5 + node.position[1]) * 0.1

    const glowScale = (1.2 + (connectionCount / 10) * 0.3) * (hovered ? 1.2 : 1)
    glowRef.current.scale.setScalar(glowScale)
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial
    glowMat.opacity = hovered ? 0.3 : 0.15 + Math.sin(t * 3 + node.position[2]) * 0.05
  })

  return (
    <group position={node.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Core soma */}
      <mesh
        ref={meshRef}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          setHovered(true)
          onHover(node)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(null)
          document.body.style.cursor = 'default'
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onClick(node)
        }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Dendrites */}
      {dendrites.map((d, i) => {
        const pos = d.dir.clone().multiplyScalar(0.8 + d.length * 0.5)
        return (
          <mesh
            key={i}
            position={[pos.x, pos.y, pos.z]}
            rotation={[d.dir.y, d.dir.x, 0]}
          >
            <cylinderGeometry args={[0.02, 0.008, d.length, 4]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}
