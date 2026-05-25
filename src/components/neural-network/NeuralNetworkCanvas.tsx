import { Suspense, useMemo, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { GraphNode3D } from '../../types/knowledge'
import { knowledgeGraph } from '../../data/knowledge-graph'
import { computeForceLayout3D } from '../../utils/layout3d'
import { NeuralNetworkScene } from './NeuralNetworkScene'

export function NeuralNetworkCanvas() {
  const navigate = useNavigate()
  const [hoveredNode, setHoveredNode] = useState<GraphNode3D | null>(null)

  const { nodes, edges } = useMemo(() => {
    const data = knowledgeGraph.getVisualizationData()
    const nodes3D = computeForceLayout3D(data.nodes, data.edges)
    return { nodes: nodes3D, edges: data.edges }
  }, [])

  const handleNodeClick = useCallback(
    (node: GraphNode3D) => {
      navigate(`/knowledge/${node.id}`)
    },
    [navigate]
  )

  return (
    <div style={{ width: '100%', height: '70vh', position: 'relative', background: '#050505' }}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <NeuralNetworkScene
            nodes={nodes}
            edges={edges}
            hoveredNode={hoveredNode}
            onNodeHover={setHoveredNode}
            onNodeClick={handleNodeClick}
          />
        </Suspense>
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#525252',
        fontSize: '0.75rem',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        拖拽旋转 · 滚轮缩放 · 点击节点查看详情
      </div>
    </div>
  )
}
