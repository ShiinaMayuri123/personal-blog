import { useState, useEffect, useMemo, useCallback } from 'react';
import { knowledgeApi, api } from '../api';
import type { KnowledgeItem } from '../types/knowledge';

interface KnowledgeGraphData {
  nodes: Array<{ id: string; label: string; category: string }>;
  edges: Array<{ id: string; source: string; target: string; type: string }>;
}

export interface UseKnowledgeGraphReturn {
  getRelated: (itemId: string) => KnowledgeItem[];
  getBacklinks: (itemId: string) => KnowledgeItem[];
  getPrerequisites: (itemId: string) => KnowledgeItem[];
  getAdvanced: (itemId: string) => KnowledgeItem[];
  loading: boolean;
  error: string | null;
}

export function useKnowledgeGraph(): UseKnowledgeGraphReturn {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [graphData, setGraphData] = useState<KnowledgeGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [itemsResponse, graphResponse] = await Promise.all([
          knowledgeApi.getAll(),
          api.get<KnowledgeGraphData>('/knowledge-graph'),
        ]);

        if (controller.signal.aborted) return;

        if (itemsResponse.success && itemsResponse.data) {
          setItems(itemsResponse.data);
        }

        if (graphResponse.success && graphResponse.data) {
          setGraphData(graphResponse.data);
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

    fetchData();
    return () => controller.abort();
  }, []);

  const knowledgeMap = useMemo(() => {
    const map = new Map<string, KnowledgeItem>();
    items.forEach(item => map.set(item.id, item));
    return map;
  }, [items]);

  return useMemo(() => ({
    getRelated: (itemId: string) => {
      if (!graphData) return [];
      return graphData.edges
        .filter(edge => edge.source === itemId || edge.target === itemId)
        .map(edge => {
          const relatedId = edge.source === itemId ? edge.target : edge.source;
          return knowledgeMap.get(relatedId);
        })
        .filter(Boolean) as KnowledgeItem[];
    },

    getBacklinks: (itemId: string) => {
      if (!graphData) return [];
      return graphData.edges
        .filter(edge => edge.target === itemId)
        .map(edge => knowledgeMap.get(edge.source))
        .filter(Boolean) as KnowledgeItem[];
    },

    getPrerequisites: (itemId: string) => {
      const item = knowledgeMap.get(itemId);
      if (!item) return [];
      return (item.prerequisiteIds ?? [])
        .map(id => knowledgeMap.get(id))
        .filter(Boolean) as KnowledgeItem[];
    },

    getAdvanced: (itemId: string) => {
      if (!graphData) return [];
      return graphData.edges
        .filter(edge => edge.source === itemId && edge.type === 'prerequisite')
        .map(edge => knowledgeMap.get(edge.target))
        .filter(Boolean) as KnowledgeItem[];
    },

    loading,
    error,
  }), [graphData, knowledgeMap, loading, error]);
}
