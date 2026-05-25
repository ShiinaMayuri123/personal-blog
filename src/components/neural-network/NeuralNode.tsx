import { useRef, useState } from 'react'
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
}

export function NeuralNode({ node, onHover, onClick }: NeuralNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const scale = DIFFICULTY_SCALE[node.difficulty] ?? 0.5
  const color = CATEGORY_COLORS[node.category] ?? '#666'

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 2 + node.position[0]) * 0.05
    meshRef.current.scale.setScalar(scale * pulse * (hovered ? 1.3 : 1))
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = hovered ? 0.8 : 0.3 + Math.sin(t * 1.5 + node.position[1]) * 0.1
  })

  return (
    <mesh
      ref={meshRef}
      position={node.position}
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
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}
