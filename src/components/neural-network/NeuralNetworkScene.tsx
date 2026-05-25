import { useMemo, useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
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
  connectionCounts: Map<string, number>
  relatedCounts: Map<string, number>
  onNodeHover: (node: GraphNode3D | null) => void
  onNodeClick: (node: GraphNode3D) => void
}

export function NeuralNetworkScene({
  nodes,
  edges,
  hoveredNode,
  connectionCounts,
  relatedCounts,
  onNodeHover,
  onNodeClick,
}: NeuralNetworkSceneProps) {
  const isMobile = useIsMobile()
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const controlsRef = useRef<any>(null)
  const [userInteracted, setUserInteracted] = useState(false)

  // Entry animation: staggered node appearance
  const entryStartRef = useRef(0)
  useFrame(({ clock }) => {
    if (entryStartRef.current === 0) entryStartRef.current = clock.getElapsedTime()
  })

  // Compute highlighted edges and nodes when hovering
  const highlightedEdgeIndices = useMemo(() => {
    if (!hoveredNode) return new Set<number>()
    const indices = new Set<number>()
    edges.forEach((edge, i) => {
      if (edge.source === hoveredNode.id || edge.target === hoveredNode.id) {
        indices.add(i)
      }
    })
    return indices
  }, [hoveredNode, edges])

  const handleInteractionStart = useCallback(() => {
    if (!userInteracted) setUserInteracted(true)
  }, [userInteracted])

  return (
    <>
      <fogExp2 attach="fog" args={["#080818", 0.02]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[20, 20, 20]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-20, -10, -20]} intensity={0.5} color="#6366f1" />
      <pointLight position={[0, 15, -10]} intensity={0.3} color="#3b82f6" />

      <ParticleField count={isMobile ? 200 : 600} />

      {edges.map((edge, i) => {
        const source = nodeMap.get(edge.source)
        const target = nodeMap.get(edge.target)
        if (!source || !target) return null
        const isHighlighted = highlightedEdgeIndices.has(i)
        return (
          <NeuralConnection
            key={`edge-${i}`}
            source={source}
            target={target}
            type={edge.type as RelationType}
            hovered={!!hoveredNode}
            highlighted={isHighlighted}
          />
        )
      })}

      {nodes.map(node => (
        <NeuralNode
          key={node.id}
          node={node}
          onHover={onNodeHover}
          onClick={onNodeClick}
          connectionCount={connectionCounts.get(node.id) ?? 0}
        />
      ))}

      {hoveredNode && (
        <NodeTooltip
          node={hoveredNode}
          connectionCount={connectionCounts.get(hoveredNode.id) ?? 0}
          relatedCount={relatedCounts.get(hoveredNode.id) ?? 0}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={25}
        autoRotate={!userInteracted}
        autoRotateSpeed={0.3}
        onStart={handleInteractionStart}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}
