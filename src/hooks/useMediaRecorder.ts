import { useCallback, useEffect, useRef, useState } from 'react'
import fixWebmDuration from 'webm-duration-fix'
import { createRecordingStream, type RecordingSource } from '@/services/audio.service'
import { getSupportedMimeType } from '@/utils/getSupportedMimeType'
import type { RecordingStatus } from '@/types/recorder.types'

export function useMediaRecorder(
  screenStream: MediaStream | null,
  micStream: MediaStream | null,
) {
  const [status, setStatus] = useState<RecordingStatus>('inactive')
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const sourceRef = useRef<RecordingSource | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = useCallback(() => {
    if (!screenStream) return

    // Video de la pantalla + audio mezclado (si hay)
    const source = createRecordingStream(screenStream, micStream)
    sourceRef.current = source

    const mimeType = getSupportedMimeType()
    const recorder = new MediaRecorder(source.stream, mimeType ? { mimeType } : undefined)

    chunksRef.current = []
    setRecordingBlob(null)

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = async () => {
      // Ya llegaron todos los fragmentos: liberamos el AudioContext
      sourceRef.current?.close()
      sourceRef.current = null

      let blob = new Blob(chunksRef.current, { type: recorder.mimeType })

      if (blob.type.includes('webm')) {
        try {
          blob = await fixWebmDuration(blob)
        } catch {
          // Si falla, usamos el blob original
        }
      }

      setRecordingBlob(blob)
      setStatus('inactive')
      recorderRef.current = null
    }

    recorder.start(1000)
    recorderRef.current = recorder
    setStatus('recording')
  }, [screenStream, micStream])

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

  // Si la pantalla deja de compartirse, cerramos la grabación
  useEffect(() => {
    if (!screenStream) stop()
  }, [screenStream, stop])

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