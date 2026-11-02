import { useCallback, useEffect, useRef, useState } from 'react'
import { getScreenStream, stopStream } from '@/services/media.service'
import type { CaptureStatus } from '@/types/recorder.types'

export function useScreenCapture() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState<CaptureStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    stopStream(streamRef.current)
    streamRef.current = null
    setStream(null)
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    stop()
    setError(null)
    setStatus('requesting')

    try {
      const newStream = await getScreenStream()
      streamRef.current = newStream

      // Si el usuario toca "Dejar de compartir" en el navegador
      newStream.getVideoTracks()[0].addEventListener('ended', stop)

      setStream(newStream)
      setStatus('active')
    } catch (err) {
      setStatus('idle')
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('Cancelaste la selección o denegaste el permiso.')
      } else {
        setError('No se pudo iniciar la captura de pantalla.')
      }
    }
  }, [stop])

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => stopStream(streamRef.current)
  }, [])

  return { stream, status, error, start, stop }
}