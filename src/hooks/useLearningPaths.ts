import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { LearningPath } from '../types/knowledge';

interface UseLearningPathsResult {
  paths: LearningPath[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLearningPaths(): UseLearningPathsResult {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaths = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<LearningPath[]>('/learning-paths');
      if (signal?.aborted) return;
      if (response.success && response.data) {
        setPaths(response.data);
      } else {
        setError(response.error || 'Failed to fetch learning paths');
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
    fetchPaths(controller.signal);
    return () => controller.abort();
  }, [fetchPaths]);

  return { paths, loading, error, refetch: () => fetchPaths() };
}
