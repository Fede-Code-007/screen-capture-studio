import { useCallback, useEffect, useState } from 'react'
import type { RecordingStatus } from '@/types/recorder.types'

export function useRecordingTimer(status: RecordingStatus) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (status !== 'recording') return

    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [status])

  const reset = useCallback(() => setSeconds(0), [])

  return { seconds, reset }
}