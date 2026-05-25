import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { GraphNode3D, GraphEdge, RelationType } from '../../types/knowledge'
import { NeuralNode } from './NeuralNode'
import { NeuralConnection } from './NeuralConnection'
import { NodeTooltip } from './NodeTooltip'
import { ParticleField } from './ParticleField'

function useIsMobile() {
  return useMemo(() => window.innerWidth < 768 || navigator.maxTouchPoints > 0, [])
}

interface NeuralNetworkSceneProps {
  nodes: GraphNode3D[]
  edges: GraphEdge[]
  hoveredNode: GraphNode3D | null
  onNodeHover: (node: GraphNode3D | null) => void
  onNodeClick: (node: GraphNode3D) => void
}

export function NeuralNetworkScene({
  nodes,
  edges,
  hoveredNode,
  onNodeHover,
  onNodeClick,
}: NeuralNetworkSceneProps) {
  const isMobile = useIsMobile()
  const nodeMap = new Map(nodes.map(n => [n.id, n]))

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 20, 20]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-20, -10, -20]} intensity={0.4} color="#3b82f6" />

      <ParticleField count={isMobile ? 150 : 400} />

      {edges.map((edge, i) => {
        const source = nodeMap.get(edge.source)
        const target = nodeMap.get(edge.target)
        if (!source || !target) return null
        return (
          <NeuralConnection
            key={`edge-${i}`}
            source={source}
            target={target}
            type={edge.type as RelationType}
          />
        )
      })}

      {nodes.map(node => (
        <NeuralNode
          key={node.id}
          node={node}
          onHover={onNodeHover}
          onClick={onNodeClick}
        />
      ))}

      {hoveredNode && <NodeTooltip node={hoveredNode} />}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={5}
        maxDistance={40}
      />
    </>
  )
}
