import { useEffect, useMemo, useState } from 'react'
import { Download, Monitor, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecorderPreview } from '@/components/recorder/RecorderPreview'
import { RecorderControls } from '@/components/recorder/RecorderControls'
import { AudioSettings } from '@/components/recorder/AudioSettings'
import { useScreenCapture } from '@/hooks/useScreenCapture'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { useMediaRecorder } from '@/hooks/useMediaRecorder'
import { useRecordingTimer } from '@/hooks/useRecordingTimer'
import { downloadBlob } from '@/services/download.service'
import { buildFileName } from '@/utils/fileName'
import { formatFileSize } from '@/utils/formatFileSize'
import { formatTime } from '@/utils/formatTime'

function App() {
  const [systemAudio, setSystemAudio] = useState(true)

  const {
    stream,
    status: captureStatus,
    error: captureError,
    audioWarning,
    start: startCapture,
    stop: stopCapture,
  } = useScreenCapture()

  const {
    enabled: micEnabled,
    setEnabled: setMicEnabled,
    deviceId,
    setDeviceId,
    devices,
    stream: micStream,
    error: micError,
  } = useAudioCapture()

  const { status, recordingBlob, start, pause, resume, stop } = useMediaRecorder(stream, micStream)
  const { seconds, reset } = useRecordingTimer(status)

  const error = captureError ?? micError

  // URL temporal para reproducir el resultado
  const recordingUrl = useMemo(
    () => (recordingBlob ? URL.createObjectURL(recordingBlob) : null),
    [recordingBlob],
  )

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

          <AudioSettings
            systemAudio={systemAudio}
            onSystemAudioChange={setSystemAudio}
            systemAudioLocked={captureStatus !== 'idle'}
            microphone={micEnabled}
            onMicrophoneChange={setMicEnabled}
            microphoneLocked={status !== 'inactive'}
            devices={devices}
            deviceId={deviceId}
            onDeviceChange={setDeviceId}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
          {audioWarning && (
            <p className="text-sm text-amber-600 dark:text-amber-400">{audioWarning}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {captureStatus !== 'active' ? (
              <Button
                onClick={() => startCapture({ systemAudio })}
                disabled={captureStatus === 'requesting'}
              >
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
