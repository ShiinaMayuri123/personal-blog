import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar, Code, MessageSquare, Mail, BookOpen, Map, Route } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import { useKnowledge, useKnowledgeStats } from '../hooks/useKnowledge'
import { BentoGrid, BentoItem } from '../components/BentoGrid'
import { SpotlightCard } from '../components/SpotlightCard'
import ErrorBoundary from '../components/ErrorBoundary'

function Home() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeTab, setActiveTab] = useState('All')
  const { articles, loading: articlesLoading, error: articlesError } = useArticles()
  const { items: knowledgeBase, loading: knowledgeLoading } = useKnowledge()
  const { stats, loading: statsLoading } = useKnowledgeStats()

  const tabs = ['All', 'Frontend', 'Architecture', 'Life']

  const filteredArticles = activeTab === 'All'
    ? articles
    : articles.filter(a => a.tags.some(tag => tag.toLowerCase().includes(activeTab.toLowerCase())))

  if (articlesLoading || knowledgeLoading || statsLoading) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载中...
        </div>
      </main>
    )
  }

  if (articlesError || !stats) {
    return (
      <main className="content-area">
        <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
          加载失败: {articlesError || '无法获取统计数据'}
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Static Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '50vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(180deg, #0a0a1a 0%, #050510 40%, #0d0520 100%)',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />
        
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}
          >
            探索知识的边界
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            style={{ color: '#a3a3a3', fontSize: '1.2rem' }}
          >
            技术思考 · 架构设计 · 学习路线
          </motion.p>
        </div>
      </section>

      {/* Overlay: Title & Nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        style={{
          position: 'absolute', top: '24px', left: 0, right: 0, zIndex: 10,
          maxWidth: '1100px', margin: '0 auto', padding: '0 64px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em', pointerEvents: 'auto' }}>
          个人博客
        </span>
        <nav style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <Link to="/" className="nav-link" style={{ color: '#737373' }}>首页</Link>
          <Link to="/map" className="nav-link" style={{ color: '#737373' }}>图谱</Link>
          <Link to="/paths" className="nav-link" style={{ color: '#737373' }}>路径</Link>
        </nav>
      </motion.div>

      <div className="content-area">
      <motion.div
        ref={headerRef}
        className="section-header"
        initial={{ opacity: 0, x: -30 }}
        animate={headerInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'baseline' }}>
          <h2 style={{ fontSize: '0.8rem' }}>探索与发现</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(150,150,150,0.1)', padding: '4px 8px', borderRadius: '4px' }}>⌘ K 搜索</span>
        </div>
        
        <div className="tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: activeTab === tab ? '1px solid transparent' : '1px solid var(--border)',
                background: activeTab === tab ? 'var(--text)' : 'transparent',
                color: activeTab === tab ? 'var(--bg)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <BentoGrid>
        {/* Profile Card */}
        <BentoItem colSpan={1} rowSpan={1}>
          <SpotlightCard className="h-full">
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 800 }}>你好，我是开发者 👋</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                专注于现代 Web 技术与架构设计。热衷于将复杂问题转化为优雅的数字体验。
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><Code size={18} /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><MessageSquare size={18} /></a>
                <a href="mailto:hi@example.com" style={{ color: 'var(--text-muted)' }}><Mail size={18} /></a>
              </div>
            </div>
          </SpotlightCard>
        </BentoItem>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <BentoItem colSpan={2} rowSpan={1}>
            <Link to={`/articles/${filteredArticles[0].slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <SpotlightCard className="h-full">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ height: '160px', background: 'linear-gradient(45deg, #111, #222)', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                     <div style={{ position: 'absolute', bottom: '16px', left: '24px' }}>
                       <span style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>FEATURED</span>
                     </div>
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text)', fontWeight: 800 }}>{filteredArticles[0].title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', flex: 1 }}>{filteredArticles[0].excerpt}</p>
                    <div className="article-meta">
                      <span className="meta-item"><Calendar size={12} />{filteredArticles[0].date}</span>
                      {filteredArticles[0].tags.map(tag => (
                        <span key={tag} className="tag" style={{ background: 'transparent', border: '1px solid var(--border)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </BentoItem>
        )}

        {/* Knowledge Stats */}
        <BentoItem colSpan={1} rowSpan={1}>
          <SpotlightCard className="h-full">
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📊 知识库统计</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalItems}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>知识点</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.totalCategories}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>分类</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.avgReadTime}m</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>平均阅读</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.avgRelations}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>平均关联</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <Map size={14} /> 图谱
                </Link>
                <Link to="/paths" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                  <Route size={14} /> 路径
                </Link>
              </div>
            </div>
          </SpotlightCard>
        </BentoItem>

        {/* Knowledge Items */}
        {knowledgeBase.slice(0, 2).map((item) => (
          <BentoItem key={item.id} colSpan={1} rowSpan={1}>
            <Link to={`/knowledge/${item.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <SpotlightCard className="h-full">
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <BookOpen size={16} color="var(--color-accent)" />
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(150,150,150,0.1)', color: 'var(--text-muted)' }}>
                      {item.difficulty}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: 'var(--text)', flex: 1, fontWeight: 700, lineHeight: 1.4 }}>{item.title}</h3>
                  <div className="article-meta" style={{ marginTop: 'auto' }}>
                    <span className="meta-item"><Calendar size={12} />{item.lastUpdated}</span>
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag" style={{ background: 'transparent', border: '1px solid var(--border)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </BentoItem>
        ))}

        {/* Remaining Articles */}
        {filteredArticles.slice(1).map((article, index) => (
          <BentoItem key={article.id} colSpan={1} rowSpan={1}>
            <Link to={`/articles/${article.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <SpotlightCard className="h-full">
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--border)', lineHeight: 1, opacity: 0.5 }}>
                      {String(index + 2).padStart(2, '0')}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: 'var(--text)', flex: 1, fontWeight: 700, lineHeight: 1.4 }}>{article.title}</h3>
                  <div className="article-meta" style={{ marginTop: 'auto' }}>
                    <span className="meta-item"><Calendar size={12} />{article.date}</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          </BentoItem>
        ))}
        
        {filteredArticles.length === 0 && (
          <BentoItem colSpan={3}>
            <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
              此分类下暂无文章
            </div>
          </BentoItem>
        )}
      </BentoGrid>
      </div>
    </main>
  )
}

export default Home
