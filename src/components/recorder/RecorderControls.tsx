import { Circle, Loader2, Pause, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RecordingStatus } from '@/types/recorder.types'

interface Props {
  status: RecordingStatus
  isStarting: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function RecorderControls({
  status,
  isStarting,
  onStart,
  onPause,
  onResume,
  onStop,
}: Props) {
  if (status === 'inactive') {
    return (
      <Button onClick={onStart} disabled={isStarting}>
        {isStarting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Circle className="size-4 fill-current text-red-500" />
        )}
        {isStarting ? 'Esperando...' : 'Grabar'}
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      {status === 'recording' ? (
        <Button variant="secondary" onClick={onPause}>
          <Pause className="size-4" />
          Pausar
        </Button>
      ) : (
        <Button variant="secondary" onClick={onResume}>
          <Play className="size-4" />
          Reanudar
        </Button>
      )}
      <Button variant="destructive" onClick={onStop}>
        <Square className="size-4" />
        Detener
      </Button>
    </div>
  )
}