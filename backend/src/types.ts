export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export type CategoryType = 'frontend' | 'architecture' | 'devops' | 'career' | 'tools';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface KnowledgeSource {
  title: string;
  url: string;
  type: 'official' | 'article' | 'video' | 'book';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  difficulty: DifficultyLevel;
  readTime: number;
  tags: string[];
  relatedIds: string[];
  prerequisiteIds: string[];
  lastUpdated: string;
  keyTakeaways: string[];
  content: string;
  sources: KnowledgeSource[];
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  knowledgeItemIds: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: string;
  x?: number;
  y?: number;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
