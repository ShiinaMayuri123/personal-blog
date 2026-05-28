export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type CategoryType = 'frontend' | 'architecture' | 'devops' | 'career' | 'tools'
export type RelationType = 'related' | 'prerequisite' | 'advanced' | 'alternative'

export interface Article {
  id: string
  title: string
  slug: string
  date: string
  excerpt: string
  tags: string[]
  content: string
}

export interface KnowledgeItem {
  id: string
  title: string
  slug: string
  category: CategoryType
  content: string
  excerpt?: string
  difficulty: DifficultyLevel
  readTime: number
  tags: string[]
  lastUpdated: string
  relatedIds: string[]
  prerequisiteIds?: string[]
  sources?: Reference[]
  keyTakeaways?: string[]
}

export interface Reference {
  title: string
  url: string
  type?: 'official' | 'article' | 'video' | 'tool'
}

export interface GraphNode {
  id: string
  title: string
  category: CategoryType
  difficulty: DifficultyLevel
  tag?: string
}

export interface GraphNode3D extends GraphNode {
  position: [number, number, number]
}

export interface GraphEdge {
  source: string
  target: string
  type: RelationType
  bidirectional?: boolean
}

export interface KnowledgeGraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface LearningPath {
  id: string
  title: string
  slug: string
  description: string
  difficulty: DifficultyLevel
  estimatedHours: number
  knowledgeItemIds: string[]
}

export interface SearchResult {
  id: string
  title: string
  slug: string
  category: CategoryType
  difficulty: DifficultyLevel
  excerpt: string
  score: number
}

export interface KnowledgeStats {
  totalItems: number
  totalCategories: number
  avgReadTime: number
  avgRelations: number
  difficultySplit: Record<DifficultyLevel, number>
  categorySplit: Record<CategoryType, number>
}
