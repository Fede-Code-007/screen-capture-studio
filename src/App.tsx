import { useEffect, useMemo } from 'react'
import { Monitor, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecorderPreview } from '@/components/recorder/RecorderPreview'
import { RecorderControls } from '@/components/recorder/RecorderControls'
import { useScreenCapture } from '@/hooks/useScreenCapture'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { useRecordingTimer } from '@/hooks/useRecordingTimer'
import { formatTime } from '@/utils/formatTime'
import { Download } from 'lucide-react'
import { downloadBlob } from '@/services/download.service'
import { buildFileName } from '@/utils/fileName'
import { formatFileSize } from '@/utils/formatFileSize'

function App() {
  const { stream, status: captureStatus, error, start: startCapture, stop: stopCapture } =
    useScreenCapture()
  const { status, recordingBlob, start, pause, resume, stop } = useMediaRecorder(stream)
  const { seconds, reset } = useRecordingTimer(status)

  // URL temporal para reproducir el resultado
  const recordingUrl = useMemo(
    () => (recordingBlob ? URL.createObjectURL(recordingBlob) : null),
    [recordingBlob],
  )

  // Liberar la URL cuando cambia o se desmonta
  useEffect(() => {
    return () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl)
    }
  }, [recordingUrl])

  const handleStart = () => {
    reset()
    start()
  }

  const handleDownload = () => {
    if (!recordingBlob) return
    downloadBlob(recordingBlob, buildFileName(recordingBlob.type))
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Screen Recorder</CardTitle>
          {status !== 'inactive' && (
            <span className="font-mono text-sm tabular-nums">
              {status === 'paused' ? '⏸ ' : '🔴 '}
              {formatTime(seconds)}
            </span>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <RecorderPreview stream={stream} />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            {captureStatus !== 'active' ? (
              <Button onClick={startCapture} disabled={captureStatus === 'requesting'}>
                <Monitor className="size-4" />
                {captureStatus === 'requesting' ? 'Esperando...' : 'Compartir pantalla'}
              </Button>
            ) : (
              <>
                <RecorderControls
                  status={status}
                  canRecord={captureStatus === 'active'}
                  onStart={handleStart}
                  onPause={pause}
                  onResume={resume}
                  onStop={stop}
                />
                {status === 'inactive' && (
                  <Button variant="outline" onClick={stopCapture}>
                    <Square className="size-4" />
                    Dejar de compartir
                  </Button>
                )}
              </>
            )}
          </div>

        {recordingUrl && recordingBlob && (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
                Tu grabación
                <span className="ml-2 font-normal text-muted-foreground">
                {formatFileSize(recordingBlob.size)}
                </span>
            </h2>
            <Button size="sm" onClick={handleDownload}>
                <Download className="size-4" />
                Descargar
            </Button>
            </div>
            <video src={recordingUrl} controls className="w-full rounded-lg border" />
        </div>
        )}
        </CardContent>
      </Card>
    </main>
  )
}

export default App