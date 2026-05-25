import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { knowledgeGraph } from '../data/knowledge-graph'
import { CategoryType } from '../types/knowledge'

const categoryColors: Record<CategoryType, string> = {
  frontend: '#3b82f6',
  architecture: '#8b5cf6',
  devops: '#10b981',
  career: '#f59e0b',
  tools: '#6b7280',
}

function KnowledgeMap() {
  const navigate = useNavigate()
  const { nodes, edges } = knowledgeGraph.getVisualizationData()

  const nodePositions = nodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length
    const radius = 200
    return {
      ...node,
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    }
  })

  const nodeMap = new Map(nodePositions.map(n => [n.id, n]))

  return (
    <>
      <motion.header
        className="article-detail-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="site-hero-inner">
          <div className="site-hero-top">
            <Link to="/" className="site-title">
              📚 知识图谱
            </Link>
            <nav className="site-nav">
              <motion.button
                className="nav-link"
                onClick={() => navigate(-1)}
                whileHover={{ x: -4 }}
              >
                <ArrowLeft size={15} />
                返回
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="content-area">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-header">知识图谱</h2>

          <div className="knowledge-map">
            <svg width="600" height="600" viewBox="0 0 600 600">
              {edges.map((edge, i) => {
                const source = nodeMap.get(edge.source)
                const target = nodeMap.get(edge.target)
                if (!source || !target) return null
                return (
                  <line
                    key={i}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={edge.type === 'prerequisite' ? '#f59e0b' : '#6b7280'}
                    strokeWidth={edge.type === 'prerequisite' ? 2 : 1}
                    strokeDasharray={edge.type === 'prerequisite' ? '5,5' : 'none'}
                    opacity={0.5}
                  />
                )
              })}

              {nodePositions.map(node => (
                <Link key={node.id} to={`/knowledge/${node.slug}`}>
                  <motion.g
                    whileHover={{ scale: 1.2 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={24}
                      fill={categoryColors[node.category]}
                      opacity={0.9}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {node.title.substring(0, 4)}
                    </text>
                  </motion.g>
                </Link>
              ))}
            </svg>

            <div className="map-legend">
              {Object.entries(categoryColors).map(([cat, color]) => (
                <div key={cat} className="legend-item">
                  <span className="legend-dot" style={{ background: color }} />
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}

export default KnowledgeMap
