import { api } from './client';
import type { KnowledgeItem, KnowledgeStats } from '../types/knowledge';

export interface CreateKnowledgeData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  readTime?: number;
  tags?: string[];
  relatedIds?: string[];
  prerequisiteIds?: string[];
  keyTakeaways?: string[];
  content?: string;
  sources?: Array<{ title: string; url: string; type: string }>;
}

export interface UpdateKnowledgeData extends Partial<CreateKnowledgeData> {}

export const knowledgeApi = {
  getAll: (params?: { category?: string; difficulty?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    const query = searchParams.toString();
    return api.get<KnowledgeItem[]>(`/knowledge${query ? `?${query}` : ''}`);
  },

  getStats: () => api.get<KnowledgeStats>('/knowledge/stats'),

  getBySlug: (slug: string) => api.get<KnowledgeItem>(`/knowledge/${slug}`),

  create: (data: CreateKnowledgeData) => api.post<KnowledgeItem>('/knowledge', data),

  update: (id: string, data: UpdateKnowledgeData) => api.put<KnowledgeItem>(`/knowledge/${id}`, data),

  delete: (id: string) => api.delete<null>(`/knowledge/${id}`),
};
