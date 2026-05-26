import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GraphNode3D, RelationType } from '../../types/knowledge'

interface RelationStyle {
  color: string
  radius: number
  opacity: number
  pattern: 'solid' | 'dashed' | 'animated'
}

const RELATION_STYLES: Record<RelationType, RelationStyle> = {
  prerequisite: { color: '#f59e0b', radius: 0.025, opacity: 0.4, pattern: 'solid' },
  related: { color: '#475569', radius: 0.01, opacity: 0.1, pattern: 'solid' },
  advanced: { color: '#3b82f6', radius: 0.018, opacity: 0.35, pattern: 'animated' },
  alternative: { color: '#7c3aed', radius: 0.012, opacity: 0.15, pattern: 'solid' },
}

interface NeuralConnectionProps {
  source: GraphNode3D
  target: GraphNode3D
  type: RelationType
  hovered?: boolean
  highlighted?: boolean
}

function FlowingSignal({
  curve,
  color,
  speed = 0.35,
  size = 0.06,
  highlighted = false,
}: {
  curve: THREE.QuadraticBezierCurve3
  color: string
  speed?: number
  size?: number
  highlighted?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = useMemo(() => Math.random() * 5, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = ((clock.getElapsedTime() * speed) + offset) % 1
    const point = curve.getPointAt(t)
    meshRef.current.position.copy(point)
  })

  const signalSize = highlighted ? size * 1.6 : size

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[signalSize, 8, 8]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent
        opacity={highlighted ? 0.95 : 0.65}
      />
    </mesh>
  )
}

export function NeuralConnection({
  source,
  target,
  type,
  hovered = false,
  highlighted = false,
}: NeuralConnectionProps) {
  const style = RELATION_STYLES[type]

  const { curve, geometry } = useMemo(() => {
    const src = new THREE.Vector3(...source.position)
    const tgt = new THREE.Vector3(...target.position)
    const mid = new THREE.Vector3().addVectors(src, tgt).multiplyScalar(0.5)

    // Organic curve: offset midpoint perpendicular to the line
    const dir = new THREE.Vector3().subVectors(tgt, src)
    const perp = new THREE.Vector3(-dir.y, dir.x, dir.z * 0.5).normalize()
    const offset = 0.3 + ((source.position[0] * 7 + target.position[1] * 13) % 1) * 0.8
    mid.add(perp.multiplyScalar(offset))

    const curve = new THREE.QuadraticBezierCurve3(src, mid, tgt)
    const geometry = new THREE.TubeGeometry(curve, 24, style.radius, 6, false)
    return { curve, geometry }
  }, [source.position, target.position, style.radius])

  // Dim connections that are NOT highlighted when some node is hovered
  const displayOpacity = hovered
    ? (highlighted ? Math.min(style.opacity * 2.5, 0.95) : style.opacity * 0.15)
    : style.opacity

  // Show signal: always for advanced, and for others if highlighted
  const shouldShowSignal = (style.pattern === 'animated' && !hovered) || highlighted

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={style.color}
          transparent
          opacity={displayOpacity}
          depthWrite={false}
        />
      </mesh>
      {shouldShowSignal && (
        <FlowingSignal
          curve={curve}
          color={style.color}
          speed={style.pattern === 'animated' ? 0.45 : 0.3}
          size={style.radius * 2.5}
          highlighted={highlighted}
        />
      )}
    </group>
  )
}
