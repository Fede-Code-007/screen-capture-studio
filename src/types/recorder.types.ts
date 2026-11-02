export type CaptureStatus = 'idle' | 'requesting' | 'active'

export type RecordingStatus = 'inactive' | 'recording' | 'paused'

export interface Recording {
  id: string
  name: string
  createdAt: number // timestamp en milisegundos
  duration: number // segundos grabados (sin contar pausas)
  size: number // bytes
  mimeType: string
  blob: Blob
}