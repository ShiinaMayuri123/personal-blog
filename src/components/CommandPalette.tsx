import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X, FileText, Home } from 'lucide-react';
import { articles } from '../data/articles';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="cmd-palette-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: '10vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="cmd-palette-container"
              style={{
                width: '100%', maxWidth: '640px', background: 'var(--bg-card)',
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)', border: '1px solid var(--border)'
              }}
            >
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', gap: '12px' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                  autoFocus
                  placeholder="搜索文章、项目或使用命令..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    color: 'var(--text)', fontSize: '1.1rem', outline: 'none'
                  }}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  ESC
                </button>
              </div>
              
              <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '12px' }}>
                {searchQuery === '' && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      快速导航
                    </div>
                    <div
                      className="cmd-item"
                      onClick={() => handleSelect('/')}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', borderRadius: '8px' }}
                    >
                      <Home size={18} color="var(--text-secondary)" />
                      <span style={{ fontSize: '0.95rem' }}>首页</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {searchQuery === '' ? '近期文章' : '搜索结果'}
                  </div>
                  {filteredArticles.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      没有找到匹配的结果
                    </div>
                  ) : (
                    filteredArticles.map(article => (
                      <div
                        key={article.id}
                        className="cmd-item"
                        onClick={() => handleSelect(`/articles/${article.slug}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', cursor: 'pointer', borderRadius: '8px' }}
                      >
                        <FileText size={18} color="var(--color-primary)" />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{article.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{article.excerpt}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        .cmd-item:hover {
          background: var(--bg);
        }
      `}</style>
    </>
  );
}
