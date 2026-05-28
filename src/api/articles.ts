import { api } from './client';
import type { Article } from '../types/knowledge';

export interface CreateArticleData {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  content: string;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export const articlesApi = {
  getAll: () => api.get<Article[]>('/articles'),

  getBySlug: (slug: string) => api.get<Article>(`/articles/${slug}`),

  create: (data: CreateArticleData) => api.post<Article>('/articles', data),

  update: (id: string, data: UpdateArticleData) => api.put<Article>(`/articles/${id}`, data),

  delete: (id: string) => api.delete<null>(`/articles/${id}`),
};
