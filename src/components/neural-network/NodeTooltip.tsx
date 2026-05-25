import { Html } from '@react-three/drei'
import { GraphNode3D } from '../../types/knowledge'

interface NodeTooltipProps {
  node: GraphNode3D
}

export function NodeTooltip({ node }: NodeTooltipProps) {
  return (
    <Html
      position={[
        node.position[0],
        node.position[1] + 1.2,
        node.position[2],
      ]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        background: 'rgba(17,17,17,0.95)',
        color: '#e5e5e5',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ marginBottom: '4px' }}>{node.title}</div>
        <div style={{
          fontSize: '11px',
          color: '#a3a3a3',
          display: 'flex',
          gap: '8px',
        }}>
          <span>{node.category}</span>
          <span>·</span>
          <span>{node.difficulty}</span>
        </div>
      </div>
    </Html>
  )
}
