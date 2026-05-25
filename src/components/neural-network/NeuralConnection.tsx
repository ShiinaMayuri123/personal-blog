import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { GraphNode3D, RelationType } from '../../types/knowledge'

const RELATION_COLORS: Record<RelationType, string> = {
  prerequisite: '#f59e0b',
  related: '#525252',
  advanced: '#3b82f6',
  alternative: '#8b5cf6',
}

interface NeuralConnectionProps {
  source: GraphNode3D
  target: GraphNode3D
  type: RelationType
}

export function NeuralConnection({ source, target, type }: NeuralConnectionProps) {
  const points = useMemo<[number, number, number][]>(
    () => [source.position, target.position],
    [source.position, target.position]
  )
  const color = RELATION_COLORS[type] ?? '#525252'
  const opacity = type === 'prerequisite' ? 0.6 : 0.2

  return (
    <Line
      points={points}
      color={color}
      lineWidth={type === 'prerequisite' ? 1.5 : 0.8}
      transparent
      opacity={opacity}
    />
  )
}
