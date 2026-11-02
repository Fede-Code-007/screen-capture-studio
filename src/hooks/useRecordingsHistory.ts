import { useCallback, useEffect, useState } from 'react'
import {
  deleteRecording,
  getAllRecordings,
  saveRecording,
} from '@/services/storage.service'
import type { Recording } from '@/types/recorder.types'

export function useRecordingsHistory() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carga inicial
  useEffect(() => {
    let cancelled = false

    getAllRecordings()
      .then((items) => {
        if (!cancelled) setRecordings(items)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar el historial.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const add = useCallback(async (recording: Recording) => {
    try {
      await saveRecording(recording)
      setRecordings((prev) => [recording, ...prev])
      setError(null)
    } catch {
      setError('No se pudo guardar la grabación en el historial (¿poco espacio?).')
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      await deleteRecording(id)
      setRecordings((prev) => prev.filter((r) => r.id !== id))
    } catch {
      setError('No se pudo eliminar la grabación.')
    }
  }, [])

  return { recordings, loading, error, add, remove }
}