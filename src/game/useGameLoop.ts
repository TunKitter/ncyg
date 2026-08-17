import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { tickAtom } from './state'

const TICK_MS = 200

/**
 * Drives production off wall-clock time rather than tick count, so a throttled
 * background tab falls behind in frames but not in output.
 */
export function useGameLoop() {
  const tick = useSetAtom(tickAtom)

  useEffect(() => {
    let last = performance.now()

    const id = setInterval(() => {
      const now = performance.now()
      tick((now - last) / 1000)
      last = now
    }, TICK_MS)

    return () => clearInterval(id)
  }, [tick])
}
