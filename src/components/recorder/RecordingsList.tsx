import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecordingItem } from '@/components/recorder/RecordingItem'
import type { Recording } from '@/types/recorder.types'

interface Props {
  recordings: Recording[]
  loading: boolean
  onDownload: (recording: Recording) => void
  onDelete: (recording: Recording) => void
}

export function RecordingsList({ recordings, loading, onDownload, onDelete }: Props) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Historial</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : recordings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay grabaciones. Las que hagas se guardan acá automáticamente.
          </p>
        ) : (
          <ul className="space-y-3">
            {recordings.map((recording) => (
              <RecordingItem
                key={recording.id}
                recording={recording}
                onDownload={onDownload}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}