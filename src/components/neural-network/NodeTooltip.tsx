import { Html } from '@react-three/drei'
import { GraphNode3D } from '../../types/knowledge'
import { knowledgeMap } from '../../data/knowledge'

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

const DIFFICULTY_STARS: Record<string, string> = {
  beginner: '⭐',
  intermediate: '⭐⭐',
  advanced: '⭐⭐⭐',
}

interface NodeTooltipProps {
  node: GraphNode3D
  connectionCount?: number
  relatedCount?: number
}

export function NodeTooltip({ node, connectionCount = 0, relatedCount = 0 }: NodeTooltipProps) {
  const color = CATEGORY_COLORS[node.category] ?? '#666'

  return (
    <Html
      position={[node.position[0], node.position[1] + 1.5, node.position[2]]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        background: 'rgba(10,10,10,0.95)',
        color: '#e5e5e5',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        minWidth: '160px',
      }}>
        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
          {node.title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: color, display: 'inline-block',
          }} />
          <span style={{ color: '#a3a3a3', fontSize: '12px' }}>
            {CATEGORY_LABELS[node.category] ?? node.category}
          </span>
          <span style={{ color: '#525252' }}>·</span>
          <span style={{ fontSize: '12px' }}>
            {DIFFICULTY_STARS[node.difficulty] ?? node.difficulty}
          </span>
        </div>

        <div style={{ color: '#737373', fontSize: '11px', marginBottom: '8px' }}>
          {knowledgeMap.get(node.id)?.readTime ?? 5} min read
        </div>

        {(connectionCount > 0 || relatedCount > 0) && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '6px',
            color: '#737373',
            fontSize: '11px',
            display: 'flex',
            gap: '12px',
          }}>
            {connectionCount > 0 && <span>📥 {connectionCount} 引用</span>}
            {relatedCount > 0 && <span>📤 {relatedCount} 相关</span>}
          </div>
        )}

        <div style={{
          marginTop: '8px',
          color: '#525252',
          fontSize: '10px',
          textAlign: 'center',
        }}>
          点击查看详情
        </div>
      </div>
    </Html>
  )
}
