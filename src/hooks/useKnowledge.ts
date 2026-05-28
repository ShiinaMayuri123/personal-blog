import { useState, useEffect, useCallback } from 'react';
import { knowledgeApi } from '../api';
import type { KnowledgeItem, KnowledgeStats } from '../types/knowledge';

interface UseKnowledgeResult {
  items: KnowledgeItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useKnowledge(params?: { category?: string; difficulty?: string }): UseKnowledgeResult {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeApi.getAll(params);
      if (signal?.aborted) return;
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to fetch knowledge items');
      }
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [params?.category, params?.difficulty]);

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(controller.signal);
    return () => controller.abort();
  }, [fetchItems]);

  return { items, loading, error, refetch: () => fetchItems() };
}

interface UseKnowledgeStatsResult {
  stats: KnowledgeStats | null;
  loading: boolean;
  error: string | null;
}

export function useKnowledgeStats(): UseKnowledgeStatsResult {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await knowledgeApi.getStats();
        if (controller.signal.aborted) return;
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to fetch stats');
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

    fetchStats();
    return () => controller.abort();
  }, []);

  return { stats, loading, error };
}

interface UseKnowledgeItemResult {
  item: KnowledgeItem | null;
  loading: boolean;
  error: string | null;
}

export function useKnowledgeItem(slug: string): UseKnowledgeItemResult {
  const [item, setItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await knowledgeApi.getBySlug(slug);
        if (controller.signal.aborted) return;
        if (response.success && response.data) {
          setItem(response.data);
        } else {
          setError(response.error || 'Knowledge item not found');
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

    fetchItem();
    return () => controller.abort();
  }, [slug]);

  return { item, loading, error };
}
