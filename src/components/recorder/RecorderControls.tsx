import { Circle, Pause, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RecordingStatus } from '@/types/recorder.types'

interface Props {
  status: RecordingStatus
  canRecord: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function RecorderControls({
  status,
  canRecord,
  onStart,
  onPause,
  onResume,
  onStop,
}: Props) {
  if (status === 'inactive') {
    return (
      <Button onClick={onStart} disabled={!canRecord}>
        <Circle className="size-4 fill-current text-red-500" />
        Grabar
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