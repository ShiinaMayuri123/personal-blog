import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Save } from 'lucide-react'
import { articlesApi } from '../../api'

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])

  const markDirty = useCallback(() => setDirty(true), [])

  useEffect(() => {
    if (!isNew && id) {
      const fetchArticle = async () => {
        try {
          const response = await articlesApi.getBySlug(id)
          if (response.success && response.data) {
            const article = response.data
            setTitle(article.title)
            setSlug(article.slug)
            setDate(article.date)
            setExcerpt(article.excerpt)
            setTags(article.tags.join(', '))
            setContent(article.content)
          }
        } catch (error) {
          console.error('Failed to fetch article:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchArticle()
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
    markDirty()
    if (isNew) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert('标题、slug 和内容不能为空')
      return
    }

    setSaving(true)
    try {
      const data = {
        title,
        slug,
        date,
        excerpt,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        content,
      }

      if (isNew) {
        const response = await articlesApi.create(data)
        if (response.success) {
          navigate('/dashboard/articles')
        } else {
          alert('创建失败: ' + response.error)
        }
      } else {
        const response = await articlesApi.update(slug, data)
        if (response.success) {
          navigate('/dashboard/articles')
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
            to="/dashboard/articles"
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
            {isNew ? '新建文章' : '编辑文章'}
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
            placeholder="文章标题"
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
            placeholder="article-slug"
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

        {/* Date and Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
              标签（逗号分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="标签1, 标签2"
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

        {/* Excerpt */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>
            摘要
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="文章摘要"
            rows={3}
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
            placeholder="文章内容（支持 Markdown）"
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
