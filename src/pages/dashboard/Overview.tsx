import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { FileText, BookOpen, Route, Network, TrendingUp } from 'lucide-react'
import { api } from '../../api/client'

interface Stats {
  articles: number
  knowledge: number
  paths: number
  graphNodes: number
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({ articles: 0, knowledge: 0, paths: 0, graphNodes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, knowledgeRes, pathsRes, graphRes] = await Promise.all([
          api.get('/articles'),
          api.get('/knowledge'),
          api.get('/learning-paths'),
          api.get('/knowledge-graph'),
        ])

        setStats({
          articles: (articlesRes.data as unknown[])?.length || 0,
          knowledge: (knowledgeRes.data as unknown[])?.length || 0,
          paths: (pathsRes.data as unknown[])?.length || 0,
          graphNodes: ((graphRes.data as { nodes: unknown[] })?.nodes)?.length || 0,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: '文章', value: stats.articles, icon: FileText, color: '#3b82f6' },
    { label: '知识点', value: stats.knowledge, icon: BookOpen, color: '#10b981' },
    { label: '学习路径', value: stats.paths, icon: Route, color: '#f59e0b' },
    { label: '图谱节点', value: stats.graphNodes, icon: Network, color: '#8b5cf6' },
  ]

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>加载中...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
          仪表盘
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          博客内容概览
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{card.label}</span>
              <card.icon size={20} color={card.color} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>
          <TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          快速操作
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/dashboard/articles/new"
            style={{
              padding: '12px 24px',
              background: 'var(--color-primary, #3b82f6)',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            新建文章
          </a>
          <a
            href="/dashboard/knowledge/new"
            style={{
              padding: '12px 24px',
              background: 'var(--bg-secondary, #222)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            新建知识点
          </a>
        </div>
      </div>
    </div>
  )
}
