import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { LayoutDashboard, FileText, BookOpen, Route, Network, ArrowLeft } from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: '概览', icon: LayoutDashboard },
  { path: '/dashboard/articles', label: '文章', icon: FileText },
  { path: '/dashboard/knowledge', label: '知识库', icon: BookOpen },
  { path: '/dashboard/paths', label: '学习路径', icon: Route },
  { path: '/dashboard/graph', label: '知识图谱', icon: Network },
]

export default function DashboardLayout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'var(--bg-secondary, #111)',
        borderRight: '1px solid var(--border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{ marginBottom: '24px', padding: '0 8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>管理后台</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dashboard</p>
        </div>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} />
          返回前台
        </Link>

        <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />

        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
