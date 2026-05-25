import { useMemo } from 'react'
import { knowledgeGraph } from '../data/knowledge-graph'
import { knowledgeMap } from '../data/knowledge'
import { KnowledgeItem } from '../types/knowledge'

export interface UseKnowledgeGraphReturn {
  getRelated: (itemId: string) => KnowledgeItem[]
  getBacklinks: (itemId: string) => KnowledgeItem[]
  getPrerequisites: (itemId: string) => KnowledgeItem[]
  getAdvanced: (itemId: string) => KnowledgeItem[]
}

export function useKnowledgeGraph(): UseKnowledgeGraphReturn {
  return useMemo(
    () => ({
      getRelated: (itemId: string) => {
        const nodes = knowledgeGraph.getRelated(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getBacklinks: (itemId: string) => {
        const nodes = knowledgeGraph.getBacklinks(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getPrerequisites: (itemId: string) => {
        const nodes = knowledgeGraph.getPrerequisites(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },

      getAdvanced: (itemId: string) => {
        const nodes = knowledgeGraph.getAdvanced(itemId)
        return nodes
          .map(node => knowledgeMap.get(node.id))
          .filter(Boolean) as KnowledgeItem[]
      },
    }),
    []
  )
}
