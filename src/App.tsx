import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, RotateCcw } from 'lucide-react'
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
import { RecordingsList } from '@/components/recorder/RecordingsList'
import { useRecordingsHistory } from '@/hooks/useRecordingsHistory'
import type { Recording } from '@/types/recorder.types'

function App() {
  const [systemAudio, setSystemAudio] = useState(true)
  const [systemVolume, setSystemVolume] = useState(1)
  const [micVolume, setMicVolume] = useState(1)

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

  const { status, recordingBlob, start, pause, resume, stop, clear } = useMediaRecorder(
    stream,
    micStream,
    { system: systemVolume, mic: micVolume },
  )
  const { seconds, reset } = useRecordingTimer(status)

  const {
    recordings,
    loading: historyLoading,
    error: historyError,
    add: addRecording,
    remove: removeRecording,
  } = useRecordingsHistory()

  // Guardamos la duración en un ref para leerla al terminar la grabación
  // sin que el efecto de guardado dependa de ella
  const secondsRef = useRef(0)
  useEffect(() => {
    secondsRef.current = seconds
  }, [seconds])

  // Evita guardar dos veces el mismo archivo (React StrictMode ejecuta los efectos dos veces en desarrollo)
  const savedBlobRef = useRef<Blob | null>(null)

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

  // Cuando la grabación termina y el archivo ya existe, dejamos de compartir pantalla
  useEffect(() => {
    if (recordingBlob) stopCapture()
  }, [recordingBlob, stopCapture])

  // Cuando aparece una grabación nueva, la guardamos en el historial
  useEffect(() => {
    if (!recordingBlob || savedBlobRef.current === recordingBlob) return
    savedBlobRef.current = recordingBlob

    const now = new Date()
    void addRecording({
      id: crypto.randomUUID(),
      name: buildFileName(recordingBlob.type, now),
      createdAt: now.getTime(),
      duration: secondsRef.current,
      size: recordingBlob.size,
      mimeType: recordingBlob.type,
      blob: recordingBlob,
    })
  }, [recordingBlob, addRecording])

  // Compartir pantalla + empezar a grabar, todo en un click
  const handleStart = async () => {
    reset()
    const screenStream = await startCapture({ systemAudio })
    if (screenStream) start(screenStream)
  }

  const handleNewRecording = () => {
    clear()
    reset()
  }

  const handleDownload = () => {
    if (!recordingBlob) return
    downloadBlob(recordingBlob, buildFileName(recordingBlob.type))
  }

  const handleDownloadFromHistory = (recording: Recording) => {
    downloadBlob(recording.blob, recording.name)
  }

  const handleDeleteFromHistory = (recording: Recording) => {
    if (window.confirm('¿Eliminar esta grabación? No se puede deshacer.')) {
      void removeRecording(recording.id)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-6">
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
          <RecorderPreview stream={stream} recordingUrl={recordingUrl} />

          <AudioSettings
            systemAudio={systemAudio}
            onSystemAudioChange={setSystemAudio}
            systemAudioLocked={captureStatus !== 'idle'}
            microphone={micEnabled}
            onMicrophoneChange={setMicEnabled}
            microphoneLocked={false}
            devices={devices}
            deviceId={deviceId}
            onDeviceChange={setDeviceId}
            systemVolume={systemVolume}
            onSystemVolumeChange={setSystemVolume}
            micVolume={micVolume}
            onMicVolumeChange={setMicVolume}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
          {historyError && <p className="text-sm text-destructive">{historyError}</p>}
          {audioWarning && (
            <p className="text-sm text-amber-600 dark:text-amber-400">{audioWarning}</p>
          )}

          {recordingBlob ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={handleDownload}>
                <Download className="size-4" />
                Descargar
              </Button>
              <Button variant="outline" onClick={handleNewRecording}>
                <RotateCcw className="size-4" />
                Grabar nuevo video
              </Button>
              <span className="text-sm text-muted-foreground">
                {formatFileSize(recordingBlob.size)}
              </span>
            </div>
          ) : (
            <RecorderControls
              status={status}
              isStarting={captureStatus === 'requesting'}
              onStart={handleStart}
              onPause={pause}
              onResume={resume}
              onStop={stop}
            />
          )}
        </CardContent>
      </Card>
      <RecordingsList
        recordings={recordings}
        loading={historyLoading}
        onDownload={handleDownloadFromHistory}
        onDelete={handleDeleteFromHistory}
      />
    </main>
  )
}

export default App