import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Clock, Target, CheckCircle2, Circle } from 'lucide-react'
import { useLearningPaths } from '../hooks/useLearningPaths'
import { useKnowledge } from '../hooks/useKnowledge'
import { useLearningProgress } from '../hooks/useLearningProgress'
import { BackButton } from '../components/BackButton'

function LearningPaths() {
  const { paths, loading, error } = useLearningPaths()
  const { items: knowledgeItems } = useKnowledge()
  const { isComplete, toggleComplete, getPathProgress } = useLearningProgress()

  const knowledgeMap = useMemo(() => {
    const map = new Map<string, { title: string; slug: string }>()
    knowledgeItems.forEach(item => map.set(item.id, { title: item.title, slug: item.slug }))
    return map
  }, [knowledgeItems])

  if (loading) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载中...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载失败: {error}
        </div>
      </main>
    )
  }

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
              📚 学习路径
            </Link>
            <nav className="site-nav">
              {/* Back button removed in favor of global BackButton */}
            </nav>
          </div>
        </div>
      </motion.header>
      <BackButton />

      <main className="content-area">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-header">学习路径</h2>

          <div className="learning-paths">
            {paths.map((path, index) => {
              const progress = getPathProgress(path.id, path.knowledgeItemIds.length)
              return (
                <motion.div
                  key={path.id}
                  className="path-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="path-header">
                    <h3>{path.title}</h3>
                    <span className={`difficulty-badge ${path.difficulty}`}>
                      {path.difficulty}
                    </span>
                  </div>

                  <p className="path-description">{path.description}</p>

                  <div className="path-meta">
                    <span className="meta-item">
                      <Clock size={14} />
                      {path.estimatedHours} 小时
                    </span>
                    <span className="meta-item">
                      <Target size={14} />
                      {path.knowledgeItemIds.length} 个知识点
                    </span>
                  </div>

                  <div className="path-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </div>

                  <div className="path-items">
                    {path.knowledgeItemIds.map((itemId, idx) => {
                      const completed = isComplete(path.id, itemId)
                      const knowledgeItem = knowledgeMap.get(itemId)
                      return (
                        <div
                          key={itemId}
                          className={`path-item ${completed ? 'completed' : ''}`}
                        >
                          <button
                            className="checkbox"
                            onClick={() => toggleComplete(path.id, itemId)}
                          >
                            {completed ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                          <span className="item-number">{idx + 1}</span>
                          {knowledgeItem ? (
                            <Link to={`/knowledge/${knowledgeItem.slug}`} className="item-link">
                              {knowledgeItem.title}
                            </Link>
                          ) : (
                            <span className="item-link">{itemId}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>
    </>
  )
}

export default LearningPaths
