import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { GraphEdge } from '../../types/knowledge'
import { knowledgeGraph } from '../../data/knowledge-graph'
import { computeTreeNetworkLayout2D, GraphNode2D } from '../../utils/layout2d'

const CATEGORY_COLORS: Record<string, string> = {
  frontend: '#3b82f6',
  architecture: '#8b5cf6',
  devops: '#10b981',
  career: '#f59e0b',
  tools: '#ef4444',
}

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  architecture: 'Architecture',
  devops: 'DevOps',
  career: 'Career',
  tools: 'Tools',
}

export function NeuralNetworkCanvas() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isZoomedOut, setIsZoomedOut] = useState(false)

  // Transform states
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)

  // Smooth zooming
  const smoothScale = useSpring(scale, { stiffness: 300, damping: 30 })

  useEffect(() => {
    return smoothScale.on('change', (v) => {
      setIsZoomedOut(v < 0.6)
    })
  }, [smoothScale])

  const { nodes, edges, clusters } = useMemo(() => {
    const data = knowledgeGraph.getVisualizationData()
    const layout = computeTreeNetworkLayout2D(data.nodes, data.edges)
    return { nodes: layout.nodes, edges: data.edges, clusters: layout.clusters }
  }, [])

  // Auto center on mount
  useEffect(() => {
      // Use window dimensions instead of containerRef to prevent 0-width issues during route animations
      x.set(window.innerWidth / 2)
      y.set(window.innerHeight / 2)
      scale.set(0.6) // Set initial scale slightly zoomed out for better view
  }, [x, y, scale])

  // Semantic Zooming transforms
  // When scale goes from 0.75 down to 0.55, nodes fade out completely
  const nodeOpacityTransform = useTransform(smoothScale, [0.55, 0.75], [0, 1])
  // When scale goes from 0.7 down to 0.4, cluster text becomes fully visible
  const clusterLabelOpacity = useTransform(smoothScale, [0.4, 0.7], [1, 0.2])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const scaleModifier = e.deltaY > 0 ? 0.9 : 1.1
    const currentScale = scale.get()
    const newScale = Math.max(0.5, Math.min(3, currentScale * scaleModifier)) // increased min scale
    scale.set(newScale)
  }

  const handleNodeClick = (node: GraphNode2D) => {
    navigate(`/knowledge/${node.id}`)
  }

  // Calculate highlighted connections
  const highlightedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>()
    const set = new Set<string>([hoveredNode])
    edges.forEach(edge => {
      if (edge.source === hoveredNode) set.add(edge.target)
      if (edge.target === hoveredNode) set.add(edge.source)
    })
    return set
  }, [hoveredNode, edges])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #050510 40%, #0d0520 100%)',
        overflow: 'hidden',
        cursor: 'grab'
      }}
      onWheel={handleWheel}
      onMouseDown={() => { document.body.style.cursor = 'grabbing' }}
      onMouseUp={() => { document.body.style.cursor = 'default' }}
      onMouseLeave={() => { document.body.style.cursor = 'default' }}
    >
      {/* Background Grid for context */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <motion.div
        drag
        style={{
          x, y, scale: smoothScale,
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          transformOrigin: '0 0'
        }}
        dragElastic={0.5}
      >
        {/* Clusters Backgrounds */}
        {clusters.map((cluster) => {
          const color = CATEGORY_COLORS[cluster.category] ?? '#666'
          const label = CATEGORY_LABELS[cluster.category] ?? cluster.category
          return (
            <div
              key={`cluster-${cluster.category}`}
              style={{
                position: 'absolute',
                left: cluster.x,
                top: cluster.y,
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle at center, ${color}15 0%, transparent 60%)`,
                borderRadius: '50%',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 0
              }}
            >
              {/* Optional background label */}
              <motion.div style={{
                position: 'absolute',
                top: '20%',
                color: color,
                fontSize: '6rem', // Magnified 300%
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: clusterLabelOpacity
              }}>
                {label}
              </motion.div>
            </div>
          )
        })}

        {/* Edges */}
        <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
            </marker>
            <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.8)" />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source)
            const target = nodes.find(n => n.id === edge.target)
            if (!source || !target) return null

            const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target
            const isFaded = hoveredNode && !isHighlighted

            const strokeColor = edge.type === 'prerequisite'
              ? (isHighlighted ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.15)')
              : (isHighlighted ? 'rgba(167, 139, 250, 0.6)' : 'rgba(167, 139, 250, 0.1)')

            const marker = isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'

            return (
              <motion.line
                key={`edge-${i}`}
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={edge.type === 'related' ? '5,5' : 'none'}
                markerEnd={edge.type === 'prerequisite' ? marker : undefined}
                style={{
                  transition: 'all 0.3s ease',
                  opacity: nodeOpacityTransform,
                  visibility: isFaded ? 'hidden' : 'visible'
                }}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const color = CATEGORY_COLORS[node.category] ?? '#666'
          const isHovered = hoveredNode === node.id
          const isHighlighted = highlightedNodes.has(node.id)
          const isFaded = hoveredNode && !isHighlighted

          return (
            <motion.div
              key={node.id}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                left: node.x,
                top: node.y,
                transform: 'translate(-50%, -50%)',
                background: `rgba(15, 15, 25, 0.7)`,
                border: `1.5px solid ${isHighlighted ? color : `${color}40`}`,
                borderTopWidth: '4px',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '140px',
                backdropFilter: 'blur(8px)',
                boxShadow: isHighlighted ? `0 0 20px ${color}40` : '0 4px 12px rgba(0,0,0,0.5)',
                transition: 'border 0.3s ease, box-shadow 0.3s ease',
                opacity: isFaded ? 0.2 : nodeOpacityTransform,
                zIndex: isHighlighted ? 10 : 1,
                pointerEvents: (isFaded || isZoomedOut) ? 'none' : 'auto'
              }}
            >
              <div style={{
                fontSize: '11px',
                color: color,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                {CATEGORY_LABELS[node.category] ?? node.category}
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.3
              }}>
                {node.title}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
