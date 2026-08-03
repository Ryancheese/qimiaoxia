import { useCallback, useEffect, useState } from 'react'

const FAVORITES_KEY = 'qimiaoxia-favorites'
const RECENT_KEY = 'qimiaoxia-recent'
const MAX_RECENT = 12

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function writeList(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => readList(FAVORITES_KEY))
  const [recent, setRecent] = useState<string[]>(() => readList(RECENT_KEY))

  useEffect(() => {
    writeList(FAVORITES_KEY, favorites)
  }, [favorites])

  useEffect(() => {
    writeList(RECENT_KEY, recent)
  }, [recent])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    )
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  )

  const addRecent = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENT))
  }, [])

  return { favorites, recent, toggleFavorite, isFavorite, addRecent }
}
