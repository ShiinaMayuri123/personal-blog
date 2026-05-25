import Fuse from 'fuse.js'
import { KnowledgeItem, SearchResult } from '../types/knowledge'
import { knowledgeBase } from '../data/knowledge'

class SearchEngine {
  private fuse: Fuse<KnowledgeItem>

  constructor() {
    this.fuse = new Fuse(knowledgeBase, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'tags', weight: 0.5 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'content', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
    })
  }

  search(query: string): SearchResult[] {
    if (!query.trim()) return []

    const results = this.fuse.search(query)

    return results.map(result => ({
      id: result.item.id,
      title: result.item.title,
      slug: result.item.slug,
      category: result.item.category,
      difficulty: result.item.difficulty,
      excerpt: result.item.excerpt || result.item.content.substring(0, 100),
      score: 1 - (result.score || 0),
    }))
  }
}

export const searchEngine = new SearchEngine()
