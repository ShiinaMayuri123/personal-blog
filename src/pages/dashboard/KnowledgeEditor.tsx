import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Save } from 'lucide-react'
import { knowledgeApi } from '../../api'

const categories = ['frontend', 'architecture', 'devops', 'career', 'tools']
const difficulties = ['beginner', 'intermediate', 'advanced']

export default function KnowledgeEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('frontend')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [readTime, setReadTime] = useState(10)
  const [tags, setTags] = useState('')
  const [keyTakeaways, setKeyTakeaways] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew && id) {
      const fetchItem = async () => {
        try {
          const response = await knowledgeApi.getBySlug(id)
          if (response.success && response.data) {
            const item = response.data
            setTitle(item.title)
            setSlug(item.slug)
            setCategory(item.category)
            setDifficulty(item.difficulty)
            setReadTime(item.readTime)
            setTags(item.tags.join(', '))
            setKeyTakeaways((item.keyTakeaways ?? []).join('\n'))
            setContent(item.content)
          }
        } catch (error) {
          console.error('Failed to fetch knowledge item:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchItem()
    }
  }, [id, isNew])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (isNew) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = async () => {
    if (!title || !slug || !category || !difficulty) {
      alert('标题、slug、分类和难度不能为空')
      return
    }

    setSaving(true)
    try {
      const data = {
        title,
        slug,
        category,
        difficulty,
        readTime,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        keyTakeaways: keyTakeaways.split('\n').map(t => t.trim()).filter(Boolean),
        content,
      }

      if (isNew) {
        const response = await knowledgeApi.create(data)
        if (response.success) {
          navigate('/dashboard/knowledge')
        } else {
          alert('创建失败: ' + response.error)
        }
      } else {
        const response = await knowledgeApi.update(id!, data)
        if (response.success) {
          navigate('/dashboard/knowledge')
        } else {
          alert('更新失败: ' + response.error)
        }
      }
    } catch (error) {
      alert('保存失败: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>加载中...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/dashboard/knowledge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={18} />
            返回
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>
            {isNew ? '新建知识点' : '编辑知识点'}
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            background: saving ? '#666' : 'var(--color-primary, #3b82f6)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Save size={18} />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Title */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="知识点标题"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Slug */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="knowledge-slug"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
            }}
          />
        </div>

        {/* Category, Difficulty, ReadTime */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
              分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-secondary, #111)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
              难度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-secondary, #111)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
              阅读时间（分钟）
            </label>
            <input
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(Number(e.target.value))}
              min={1}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-secondary, #111)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            标签（逗号分隔）
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="React, Hooks, State"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Key Takeaways */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            核心要点（每行一个）
          </label>
          <textarea
            value={keyTakeaways}
            onChange={(e) => setKeyTakeaways(e.target.value)}
            placeholder="要点1&#10;要点2&#10;要点3"
            rows={4}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.9rem',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Content */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="知识点内容（支持 Markdown）"
            rows={20}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--bg-secondary, #111)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
