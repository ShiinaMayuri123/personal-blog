import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { Article } from '../data/articles'

const mockArticle: Article = {
  id: '1',
  title: '测试文章标题',
  slug: 'test-article',
  date: '2026-05-19',
  excerpt: '这是测试文章的摘要',
  tags: ['测试', '示例'],
  content: '测试文章内容',
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ArticleCard', () => {
  it('renders article title as link', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link', { name: '测试文章标题' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })

  it('renders article excerpt', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('这是测试文章的摘要')).toBeInTheDocument()
  })

  it('renders article date', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('2026-05-19')).toBeInTheDocument()
  })

  it('renders article tags', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('测试')).toBeInTheDocument()
    expect(screen.getByText('示例')).toBeInTheDocument()
  })

  it('renders article card with correct class', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    const card = screen.getByRole('article')
    expect(card).toHaveClass('article-card')
  })
})
