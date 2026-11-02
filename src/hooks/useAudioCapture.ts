import { useEffect, useState } from 'react'
import {
  getMicrophoneStream,
  listAudioInputs,
  stopStream,
} from '@/services/media.service'

function getMicErrorMessage(name: string): string {
  switch (name) {
    case 'NotAllowedError':
      return 'Permiso de micrófono denegado.'
    case 'NotFoundError':
      return 'No se encontró ningún micrófono.'
    case 'OverconstrainedError':
      return 'El micrófono elegido ya no está disponible.'
    default:
      return 'No se pudo acceder al micrófono.'
  }
}

export function useAudioCapture() {
  const [enabled, setEnabled] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  // Abre el micrófono cuando se activa o cambia de dispositivo
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let current: MediaStream | null = null

    async function open() {
      try {
        const micStream = await getMicrophoneStream(deviceId || undefined)

        if (cancelled) {
          stopStream(micStream)
          return
        }

        current = micStream

        // Dispositivo desconectado
        micStream.getAudioTracks()[0].addEventListener('ended', () => {
          setError('El micrófono se desconectó.')
          setEnabled(false)
        })

        setError(null)
        setStream(micStream)
        setDevices(await listAudioInputs())
      } catch (err) {
        if (cancelled) return

        const name = err instanceof Error ? err.name : ''
        if (name === 'OverconstrainedError') setDeviceId('')
        setError(getMicErrorMessage(name))
        setEnabled(false)
      }
    }

    void open()

    return () => {
      cancelled = true
      stopStream(current)
      setStream(null)
    }
  }, [enabled, deviceId])

  // Mantiene la lista de dispositivos actualizada al conectar o desconectar
  useEffect(() => {
    if (!enabled) return

    const refresh = () => {
      void listAudioInputs().then(setDevices)
    }

    navigator.mediaDevices.addEventListener('devicechange', refresh)
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh)
  }, [enabled])

  return { enabled, setEnabled, deviceId, setDeviceId, devices, stream, error }
}