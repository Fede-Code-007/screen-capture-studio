import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupportedMimeType } from '@/utils/getSupportedMimeType'
import type { RecordingStatus } from '@/types/recorder.types'
import fixWebmDuration from 'webm-duration-fix'

export function useMediaRecorder(stream: MediaStream | null) {
  const [status, setStatus] = useState<RecordingStatus>('inactive')
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = useCallback(() => {
    if (!stream) return

    const mimeType = getSupportedMimeType()
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

    chunksRef.current = []
    setRecordingBlob(null)

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = async () => {
    let blob = new Blob(chunksRef.current, { type: recorder.mimeType })

    // Solo WebM necesita el arreglo de duración
    if (blob.type.includes('webm')) {
        try {
        blob = await fixWebmDuration(blob)
        } catch {
        // Si falla, usamos el blob original sin corregir
        }
    }

    setRecordingBlob(blob)
    setStatus('inactive')
    recorderRef.current = null
    }

    recorder.start(1000) // entrega un fragmento cada 1 segundo
    recorderRef.current = recorder
    setStatus('recording')
  }, [stream])

  const pause = useCallback(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.pause()
      setStatus('paused')
    }
  }, [])

  const resume = useCallback(() => {
    if (recorderRef.current?.state === 'paused') {
      recorderRef.current.resume()
      setStatus('recording')
    }
  }, [])

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }
  }, [])

  // Si el stream desaparece (el usuario deja de compartir), cerramos la grabación
  useEffect(() => {
    if (!stream) stop()
  }, [stream, stop])

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop()
      }
    }
  }, [])

  return { status, recordingBlob, start, pause, resume, stop }
}