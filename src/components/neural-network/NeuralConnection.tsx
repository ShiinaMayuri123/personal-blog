import { useMemo } from 'react'
import * as THREE from 'three'
import { GraphNode3D, RelationType } from '../../types/knowledge'

interface RelationStyle {
  color: string
  radius: number
  opacity: number
  pattern: 'solid' | 'dashed' | 'animated'
}

const RELATION_STYLES: Record<RelationType, RelationStyle> = {
  prerequisite: { color: '#f59e0b', radius: 0.04, opacity: 0.7, pattern: 'solid' },
  related: { color: '#64748b', radius: 0.02, opacity: 0.2, pattern: 'solid' },
  advanced: { color: '#3b82f6', radius: 0.03, opacity: 0.4, pattern: 'animated' },
  alternative: { color: '#8b5cf6', radius: 0.02, opacity: 0.15, pattern: 'solid' },
}

interface NeuralConnectionProps {
  source: GraphNode3D
  target: GraphNode3D
  type: RelationType
  hovered?: boolean
  highlighted?: boolean
}

export function NeuralConnection({
  source,
  target,
  type,
  highlighted = false,
}: NeuralConnectionProps) {
  const style = RELATION_STYLES[type]

  const geometry = useMemo(() => {
    const src = new THREE.Vector3(...source.position)
    const tgt = new THREE.Vector3(...target.position)
    const mid = new THREE.Vector3().addVectors(src, tgt).multiplyScalar(0.5)

    // Organic curve: offset midpoint perpendicular to the line
    const dir = new THREE.Vector3().subVectors(tgt, src)
    const perp = new THREE.Vector3(-dir.y, dir.x, dir.z * 0.5).normalize()
    const offset = 0.3 + ((source.position[0] * 7 + target.position[1] * 13) % 1) * 0.8
    mid.add(perp.multiplyScalar(offset))

    const curve = new THREE.QuadraticBezierCurve3(src, mid, tgt)
    return new THREE.TubeGeometry(curve, 24, style.radius, 6, false)
  }, [source.position, target.position, style.radius])

  const displayOpacity = highlighted ? Math.min(style.opacity * 2.5, 1) : style.opacity

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={style.color}
        transparent
        opacity={displayOpacity}
        depthWrite={false}
      />
    </mesh>
  )
}
