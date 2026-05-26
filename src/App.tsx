import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import KnowledgeDetail from './pages/KnowledgeDetail'
import KnowledgeMap from './pages/KnowledgeMap'
import LearningPaths from './pages/LearningPaths'
import ErrorBoundary from './components/ErrorBoundary'
import ThemeToggle from './components/ThemeToggle'
import { CommandPalette } from './components/CommandPalette'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isMap = location.pathname === '/map'

  return (
    <ErrorBoundary>
      <CommandPalette />
      <div className="app-shell">
        <AnimatePresence mode="wait">
          {(!isHome && !isMap) && (
            <motion.header
              key="nav-header"
              className="site-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ paddingBottom: 0 }}
            >
              <div className="site-hero-inner" style={{ paddingBottom: '24px' }}>
                <div className="site-hero-top" style={{ marginBottom: 0 }}>
                  <Link to="/" className="site-title">个人博客</Link>
                  <nav className="site-nav">
                    <Link to="/" className="nav-link">
                      <HomeIcon size={15} />
                      首页
                    </Link>
                    <Link to="/map" className="nav-link">图谱</Link>
                    <Link to="/paths" className="nav-link">路径</Link>
                    <ThemeToggle />
                  </nav>
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/knowledge/:slug" element={<KnowledgeDetail />} />
              <Route path="/map" element={<KnowledgeMap />} />
              <Route path="/paths" element={<LearningPaths />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {!isMap && (
          <footer className="site-footer">
            <p>© 2026 个人博客</p>
            <p>React + Vite + TypeScript</p>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
