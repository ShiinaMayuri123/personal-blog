import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ArticleDetail from '../pages/ArticleDetail'

const renderWithRouter = (route = '/') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/articles/:slug" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ArticleDetail', () => {
  it('renders article title', () => {
    renderWithRouter('/articles/welcome-to-my-blog')
    expect(screen.getByText('欢迎来到我的个人博客')).toBeInTheDocument()
  })

  it('renders article content', () => {
    renderWithRouter('/articles/welcome-to-my-blog')
    const content = screen.getByText(/这个项目的目标是搭建一个可维护、可扩展的博客系统/)
    expect(content).toBeInTheDocument()
  })

  it('renders article date', () => {
    renderWithRouter('/articles/welcome-to-my-blog')
    expect(screen.getByText('2026-05-19')).toBeInTheDocument()
  })

  it('renders article tags', () => {
    renderWithRouter('/articles/welcome-to-my-blog')
    expect(screen.getByText('介绍')).toBeInTheDocument()
    expect(screen.getByText('规划')).toBeInTheDocument()
  })

  it('renders back link', () => {
    renderWithRouter('/articles/welcome-to-my-blog')
    expect(screen.getByText(/返回/)).toBeInTheDocument()
  })

  it('renders not found message for invalid slug', () => {
    renderWithRouter('/articles/non-existent')
    expect(screen.getByText('文章未找到')).toBeInTheDocument()
  })

  it('renders back to home link when article not found', () => {
    renderWithRouter('/articles/non-existent')
    expect(screen.getByText(/返回首页/)).toBeInTheDocument()
  })
})
