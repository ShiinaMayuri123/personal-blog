import { Link } from 'react-router-dom'
import { Calendar, Tag } from 'lucide-react'
import { Article } from '../data/articles'

interface ArticleCardProps {
  article: Article
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <Link to={`/articles/${article.slug}`}>
        <h3>{article.title}</h3>
      </Link>
      <p>{article.excerpt}</p>
      <div className="article-meta">
        <span className="meta-item">
          <Calendar size={12} />
          {article.date}
        </span>
        {article.tags.map(tag => (
          <span key={tag} className="tag">
            <Tag size={11} />
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

export default ArticleCard
