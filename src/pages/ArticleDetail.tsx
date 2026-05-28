import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { useArticle } from '../hooks/useArticles'
import { BackButton } from '../components/BackButton'

function ArticleDetail() {
  const { slug } = useParams()
  const { article, loading, error } = useArticle(slug || '')

  if (loading) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载中...
        </div>
      </main>
    )
  }

  if (error || !article) {
    return (
      <main className="content-area">
        <section className="not-found">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            文章未找到
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            抱歉，未能找到你要访问的文章。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link to="/" className="article-back">
              <ArrowLeft size={16} />
              返回首页
            </Link>
          </motion.div>
        </section>
      </main>
    )
  }

  return (
    <>
      <header className="article-detail-hero">
        <div className="site-hero-inner">
          <div className="site-hero-top" style={{ marginBottom: 0 }}>
            <Link to="/" className="site-title">个人博客</Link>
            <nav className="site-nav">
              {/* Back button replaced by global BackButton */}
            </nav>
          </div>
        </div>
      </header>
      <BackButton />

      <motion.article
        className="article-detail-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24 }}
        >
          {article.title}
        </motion.h1>

        <motion.div
          className="article-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          style={{ marginBottom: 48, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}
        >
          <span className="meta-item">
            <Calendar size={14} />
            {article.date}
          </span>
          {article.tags.map((tag) => (
            <motion.span
              key={tag}
              className="tag"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.15 }}
            >
              <Tag size={11} />
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="article-body"
          style={{ whiteSpace: 'pre-wrap' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {article.content}
        </motion.div>
      </motion.article>
    </>
  )
}

export default ArticleDetail
