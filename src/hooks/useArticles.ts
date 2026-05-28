import { useState, useEffect, useCallback } from 'react';
import { articlesApi } from '../api';
import type { Article } from '../types/knowledge';

interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getAll();
      if (signal?.aborted) return;
      if (response.success && response.data) {
        setArticles(response.data);
      } else {
        setError(response.error || 'Failed to fetch articles');
      }
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchArticles(controller.signal);
    return () => controller.abort();
  }, [fetchArticles]);

  return { articles, loading, error, refetch: () => fetchArticles() };
}

interface UseArticleResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

export function useArticle(slug: string): UseArticleResult {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await articlesApi.getBySlug(slug);
        if (controller.signal.aborted) return;
        if (response.success && response.data) {
          setArticle(response.data);
        } else {
          setError(response.error || 'Article not found');
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();
    return () => controller.abort();
  }, [slug]);

  return { article, loading, error };
}
