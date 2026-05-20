import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Home as HomeIcon } from 'lucide-react'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import ErrorBoundary from './components/ErrorBoundary'
import ThemeToggle from './components/ThemeToggle'
import { CommandPalette } from './components/CommandPalette'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <ErrorBoundary>
      <CommandPalette />
      <div className="app-shell">
        <AnimatePresence mode="wait">
          {isHome && (
            <motion.header
              key="hero"
              className="site-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className="site-hero-inner">
                <div className="site-hero-top">
                  <Link to="/" className="site-title">个人博客</Link>
                  <nav className="site-nav">
                    <Link to="/" className="nav-link">
                      <HomeIcon size={15} />
                      首页
                    </Link>
                    <ThemeToggle />
                  </nav>
                </div>
                <div className="hero-content">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                  >
                    记录、思考、<br /><span>构建更好的东西。</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                  >
                    一个关于前端开发、架构设计和技术探索的个人空间。
                  </motion.p>
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
            </Routes>
          </motion.div>
        </AnimatePresence>

        <footer className="site-footer">
          <p>© 2026 个人博客</p>
          <p>React + Vite + TypeScript</p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
