import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Clock, Target, CheckCircle2, Circle } from 'lucide-react'
import { learningPaths } from '../data/learning-paths'
import { knowledgeMap } from '../data/knowledge'
import { useLearningProgress } from '../hooks/useLearningProgress'

function LearningPaths() {
  const navigate = useNavigate()
  const { isComplete, toggleComplete, getPathProgress } = useLearningProgress()

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
              <motion.button
                className="nav-link"
                onClick={() => navigate(-1)}
                whileHover={{ x: -4 }}
              >
                <ArrowLeft size={15} />
                返回
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="content-area">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-header">学习路径</h2>

          <div className="learning-paths">
            {learningPaths.map((path, index) => {
              const progress = getPathProgress(path.id)
              return (
                <motion.div
                  key={path.id}
                  className="path-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="path-header">
                    <h3>{path.name}</h3>
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
                      {path.itemIds.length} 个知识点
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
                    {path.itemIds.map((itemId, idx) => {
                      const item = knowledgeMap.get(itemId)
                      if (!item) return null
                      const completed = isComplete(path.id, itemId)
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
                          <Link
                            to={`/knowledge/${item.slug}`}
                            className="item-link"
                          >
                            {item.title}
                          </Link>
                        </div>
                      )
                    })}
                  </div>

                  {path.goals.length > 0 && (
                    <div className="path-goals">
                      <h4>学习目标</h4>
                      <ul>
                        {path.goals.map((goal, idx) => (
                          <li key={idx}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
