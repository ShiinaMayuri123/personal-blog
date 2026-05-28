import { useState, useCallback } from 'react'

const STORAGE_KEY = 'learning-progress'

interface ProgressData {
  [pathId: string]: {
    [itemId: string]: boolean
  }
}

function loadProgress(): ProgressData {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress)

  const isComplete = useCallback(
    (pathId: string, itemId: string) => {
      return progress[pathId]?.[itemId] ?? false
    },
    [progress]
  )

  const toggleComplete = useCallback(
    (pathId: string, itemId: string) => {
      setProgress(prev => {
        const newData = { ...prev }
        if (!newData[pathId]) {
          newData[pathId] = {}
        }
        newData[pathId] = { ...newData[pathId] }
        newData[pathId][itemId] = !newData[pathId][itemId]
        saveProgress(newData)
        return newData
      })
    },
    []
  )

  const getPathProgress = useCallback(
    (pathId: string, totalItems: number) => {
      const pathData = progress[pathId]
      if (!pathData || totalItems === 0) return 0
      const completed = Object.values(pathData).filter(Boolean).length
      return Math.round((completed / totalItems) * 100)
    },
    [progress]
  )

  return { isComplete, toggleComplete, getPathProgress }
}
