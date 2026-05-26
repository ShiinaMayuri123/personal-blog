import { useMemo, useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
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
  const parallaxGroupRef = useRef<THREE.Group>(null)
  const [userInteracted, setUserInteracted] = useState(false)

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

  // Mouse Parallax Animation
  useFrame((state) => {
    if (parallaxGroupRef.current) {
      // Gentle parallax rotation based on mouse coordinates
      const targetRotY = state.mouse.x * 0.12
      const targetRotX = -state.mouse.y * 0.12

      parallaxGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        parallaxGroupRef.current.rotation.y,
        targetRotY,
        0.05
      )
      parallaxGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        parallaxGroupRef.current.rotation.x,
        targetRotX,
        0.05
      )
    }
  })

  return (
    <>
      <fogExp2 attach="fog" args={["#060612", 0.022]} />

      {/* Advanced High-Contrast Three-Point Lighting for Glass Materials */}
      <ambientLight intensity={0.25} />
      {/* Top-front white key light */}
      <pointLight position={[15, 25, 15]} intensity={1.8} color="#ffffff" />
      {/* Bottom-left purple fill light */}
      <pointLight position={[-20, -15, -15]} intensity={1.4} color="#a78bfa" />
      {/* Top-right cyan back light */}
      <pointLight position={[20, 15, -10]} intensity={1.2} color="#22d3ee" />

      {/* Parallax Container wrapping all objects */}
      <group ref={parallaxGroupRef}>
        <ParticleField count={isMobile ? 220 : 650} />

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
      </group>

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

      {/* Optimized Bloom Settings for Neon Glowing Effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.8}
          intensity={1.8}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}
