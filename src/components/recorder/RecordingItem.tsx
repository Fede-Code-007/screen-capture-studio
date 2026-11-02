import { useEffect, useMemo, useState } from 'react'
import { Download, Play, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/utils/formatFileSize'
import { formatTime } from '@/utils/formatTime'
import type { Recording } from '@/types/recorder.types'

interface Props {
  recording: Recording
  onDownload: (recording: Recording) => void
  onDelete: (recording: Recording) => void
}

export function RecordingItem({ recording, onDownload, onDelete }: Props) {
  const [playing, setPlaying] = useState(false)

  // La URL solo existe mientras el video está abierto
  const url = useMemo(
    () => (playing ? URL.createObjectURL(recording.blob) : null),
    [playing, recording.blob],
  )

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  const date = new Date(recording.createdAt).toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <li className="space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{date}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(recording.duration)} · {formatFileSize(recording.size)}
          </p>
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <X className="size-4" /> : <Play className="size-4" />}
            {playing ? 'Cerrar' : 'Ver'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDownload(recording)}>
            <Download className="size-4" />
            <span className="sr-only">Descargar</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(recording)}>
            <Trash2 className="size-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </div>

      {url && (
        <video
          src={`${url}#t=0.001`}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full rounded-lg border bg-black object-contain"
        />
      )}
    </li>
  )
}