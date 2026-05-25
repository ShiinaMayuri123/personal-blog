import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

vi.mock('../components/neural-network', () => ({
  NeuralNetworkCanvas: () => <div data-testid="neural-network-canvas" />,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Home', () => {
  it('renders the page title', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('探索与发现')).toBeInTheDocument()
  })

  it('renders all articles', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('欢迎来到我的个人博客')).toBeInTheDocument()
    expect(screen.getByText('为什么选用前端静态博客作为起点')).toBeInTheDocument()
  })

  it('renders featured article excerpt', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText(/这是第一篇文章/)).toBeInTheDocument()
  })

  it('renders article dates', () => {
    renderWithRouter(<Home />)
    const dates = screen.getAllByText('2026-05-19')
    expect(dates.length).toBeGreaterThan(0)
  })

  it('renders featured article tags', () => {
    renderWithRouter(<Home />)
    expect(screen.getByText('介绍')).toBeInTheDocument()
    expect(screen.getByText('规划')).toBeInTheDocument()
  })

  it('renders neural network canvas', () => {
    renderWithRouter(<Home />)
    expect(screen.getByTestId('neural-network-canvas')).toBeInTheDocument()
  })
})
