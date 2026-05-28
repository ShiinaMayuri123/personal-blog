import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Tag, Clock, Zap } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useKnowledgeItem } from '../hooks/useKnowledge'
import { useKnowledgeGraph } from '../hooks/useKnowledgeGraph'
import { BackButton } from '../components/BackButton'

function KnowledgeDetail() {
  const { slug } = useParams()
  const { item, loading, error } = useKnowledgeItem(slug || '')
  const { getRelated, getBacklinks, getPrerequisites, getAdvanced } = useKnowledgeGraph()

  if (loading) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载中...
        </div>
      </main>
    )
  }

  if (error || !item) {
    return (
      <main className="content-area">
        <motion.div
          className="not-found"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>知识点未找到</h1>
          <p>抱歉，未能找到你要访问的知识点。</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            返回首页
          </Link>
        </motion.div>
      </main>
    )
  }

  const related = getRelated(item.id)
  const backlinks = getBacklinks(item.id)
  const prerequisites = getPrerequisites(item.id)
  const advanced = getAdvanced(item.id)

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
              📚 知识库
            </Link>
            <nav className="site-nav">
              {/* Back button replaced by global BackButton */}
            </nav>
          </div>
        </div>
      </motion.header>
      <BackButton />

      <motion.article
        className="knowledge-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="knowledge-title"
        >
          {item.title}
        </motion.h1>

        <motion.div
          className="knowledge-meta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <span className="meta-item">
            <Calendar size={14} />
            {item.lastUpdated}
          </span>
          <span className="meta-item difficulty">
            <Zap size={14} />
            {item.difficulty}
          </span>
          <span className="meta-item">
            <Clock size={14} />
            {item.readTime} 分钟阅读
          </span>
          {item.tags.map(tag => (
            <span key={tag} className="tag">
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </motion.div>

        {item.keyTakeaways && item.keyTakeaways.length > 0 && (
          <motion.section
            className="key-takeaways"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>🎯 核心要点</h3>
            <ul>
              {item.keyTakeaways.map((takeaway, idx) => (
                <li key={idx}>{takeaway}</li>
              ))}
            </ul>
          </motion.section>
        )}

        <motion.div
          className="knowledge-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
        </motion.div>

        {prerequisites.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>📋 前置知识</h3>
            <p>建议先学习以下内容：</p>
            <div className="related-grid">
              {prerequisites.map(prereq => (
                <Link
                  key={prereq.id}
                  to={`/knowledge/${prereq.slug}`}
                  className="related-card prerequisite"
                >
                  {prereq.title}
                  <span className="difficulty-badge">{prereq.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {related.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>🔗 相关知识</h3>
            <div className="related-grid">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/knowledge/${rel.slug}`}
                  className="related-card"
                >
                  {rel.title}
                  <span className="difficulty-badge">{rel.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {advanced.length > 0 && (
          <motion.section className="related-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>🚀 进阶内容</h3>
            <p>学完本章后可以继续学习：</p>
            <div className="related-grid">
              {advanced.map(adv => (
                <Link
                  key={adv.id}
                  to={`/knowledge/${adv.slug}`}
                  className="related-card advanced"
                >
                  {adv.title}
                  <span className="difficulty-badge">{adv.difficulty}</span>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {item.sources && item.sources.length > 0 && (
          <motion.section className="sources" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>📚 参考资源</h3>
            <ul>
              {item.sources.map((source, idx) => (
                <li key={idx}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                  {source.type && <span className="source-type">{source.type}</span>}
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {backlinks.length > 0 && (
          <motion.section className="backlinks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>👈 谁引用了这个</h3>
            <p>以下内容引用了这个知识点：</p>
            <ul>
              {backlinks.map(link => (
                <li key={link.id}>
                  <Link to={`/knowledge/${link.slug}`}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </motion.article>
    </>
  )
}

export default KnowledgeDetail
