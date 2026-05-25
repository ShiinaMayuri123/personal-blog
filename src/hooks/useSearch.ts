import { useState, useCallback } from 'react'
import { SearchResult } from '../types/knowledge'
import { searchEngine } from '../utils/search'

export interface UseSearchReturn {
  results: SearchResult[]
  isSearching: boolean
  search: (query: string) => void
  clear: () => void
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const search = useCallback((query: string) => {
    setIsSearching(true)
    try {
      const searchResults = searchEngine.search(query)
      setResults(searchResults)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
  }, [])

  return { results, isSearching, search, clear }
}
