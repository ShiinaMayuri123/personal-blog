import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, Edit, Trash2, Clock, Tag, Zap } from 'lucide-react'
import { knowledgeApi } from '../../api'
import type { KnowledgeItem } from '../../types/knowledge'

export default function KnowledgeList() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await knowledgeApi.getAll()
      if (response.success && response.data) {
        setItems(response.data)
      } else {
        setError(response.error || 'Failed to fetch knowledge items')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个知识点吗？')) return

    try {
      const response = await knowledgeApi.delete(id)
      if (response.success) {
        setItems(items.filter(item => item.id !== id))
      } else {
        alert('删除失败: ' + response.error)
      }
    } catch (err) {
      alert('删除失败: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>加载中...</div>
  }

  if (error) {
    return <div style={{ color: '#ef4444' }}>错误: {error}</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
            知识库管理
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            共 {items.length} 个知识点
          </p>
        </div>
        <Link
          to="/dashboard/knowledge/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--color-primary, #3b82f6)',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Plus size={18} />
          新建知识点
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                  {item.title}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  background: item.category === 'frontend' ? 'rgba(59, 130, 246, 0.2)' :
                    item.category === 'architecture' ? 'rgba(16, 185, 129, 0.2)' :
                    item.category === 'devops' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  color: item.category === 'frontend' ? '#3b82f6' :
                    item.category === 'architecture' ? '#10b981' :
                    item.category === 'devops' ? '#f59e0b' : '#8b5cf6',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}>
                  {item.category}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: item.difficulty === 'beginner' ? '#10b981' :
                    item.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                  fontSize: '0.75rem',
                }}>
                  <Zap size={12} />
                  {item.difficulty}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Clock size={14} />
                  {item.readTime} 分钟
                </span>
                {item.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
              <Link
                to={`/dashboard/knowledge/${item.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                }}
              >
                <Edit size={14} />
                编辑
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                <Trash2 size={14} />
                删除
              </button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            color: 'var(--text-muted)',
          }}>
            暂无知识点
          </div>
        )}
      </div>
    </div>
  )
}
