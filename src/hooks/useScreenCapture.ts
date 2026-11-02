import { useCallback, useEffect, useRef, useState } from 'react'
import { getScreenStream, stopStream } from '@/services/media.service'
import type { CaptureStatus } from '@/types/recorder.types'

interface StartOptions {
  systemAudio: boolean
}

export function useScreenCapture() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState<CaptureStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [audioWarning, setAudioWarning] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stop = useCallback(() => {
    stopStream(streamRef.current)
    streamRef.current = null
    setStream(null)
    setStatus('idle')
    setAudioWarning(null)
  }, [])

  const start = useCallback(
    async ({ systemAudio }: StartOptions): Promise<MediaStream | null> => {
      stop()
      setError(null)
      setStatus('requesting')

      try {
        const newStream = await getScreenStream(systemAudio)
        streamRef.current = newStream

        // Si el usuario toca "Dejar de compartir" en el navegador
        newStream.getVideoTracks()[0].addEventListener('ended', stop)

        if (systemAudio && newStream.getAudioTracks().length === 0) {
          setAudioWarning(
            'No se compartió el audio del sistema. Marcá la casilla de audio en el selector del navegador (no está disponible al compartir una ventana).',
          )
        }

        setStream(newStream)
        setStatus('active')
        return newStream
      } catch (err) {
        setStatus('idle')
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Cancelaste la selección o denegaste el permiso.')
        } else {
          setError('No se pudo iniciar la captura de pantalla.')
        }
        return null
      }
    },
    [stop],
  )

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => stopStream(streamRef.current)
  }, [])

  return { stream, status, error, audioWarning, start, stop }
}