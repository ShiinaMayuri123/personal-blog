import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, Edit, Trash2, Calendar, Tag } from 'lucide-react'
import { articlesApi } from '../../api'
import type { Article } from '../../types/knowledge'

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await articlesApi.getAll()
      if (response.success && response.data) {
        setArticles(response.data)
      } else {
        setError(response.error || 'Failed to fetch articles')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const response = await articlesApi.delete(id)
      if (response.success) {
        setArticles(articles.filter(a => a.id !== id))
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
            文章管理
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            共 {articles.length} 篇文章
          </p>
        </div>
        <Link
          to="/dashboard/articles/new"
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
          新建文章
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                {article.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                {article.excerpt}
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Calendar size={14} />
                  {article.date}
                </span>
                {article.tags.map(tag => (
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
                to={`/dashboard/articles/${article.slug}`}
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
                onClick={() => handleDelete(article.id)}
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

        {articles.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            color: 'var(--text-muted)',
          }}>
            暂无文章
          </div>
        )}
      </div>
    </div>
  )
}
