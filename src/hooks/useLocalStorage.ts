import { useCallback, useEffect, useState } from 'react'

/**
 * Persists state to localStorage.
 * The setter accepts either a direct value or an updater function,
 * matching the full React.Dispatch<SetStateAction<T>> contract.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return initialValue
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  // Persist every time value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage quota exceeded – silently ignore
    }
  }, [key, value])

  // Wrap setValue so callers can use either the direct value or updater form
  const set = useCallback(
    (action: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof action === 'function'
            ? (action as (prev: T) => T)(prev)
            : action
        // Write synchronously so a hard reload immediately after this call
        // still picks up the latest value.
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [key],
  )

  return [value, set] as const
}
