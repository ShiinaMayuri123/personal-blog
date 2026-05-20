import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { useRef, useState } from 'react'
import { Calendar, Tag, Code, MessageSquare, Mail } from 'lucide-react'
import { articles } from '../data/articles'
import { BentoGrid, BentoItem } from '../components/BentoGrid'
import { SpotlightCard } from '../components/SpotlightCard'

function Home() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })
  const [activeTab, setActiveTab] = useState('All')

  const tabs = ['All', 'Frontend', 'Architecture', 'Life']
  
  // A simple hack: if a tag matches the tab name, keep it. 
  // In reality, you'd match the tags more robustly.
  const filteredArticles = activeTab === 'All' 
    ? articles 
    : articles.filter(a => a.tags.some(tag => tag.toLowerCase().includes(activeTab.toLowerCase())))

  return (
    <main className="content-area">
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
    </main>
  )
}

export default Home
