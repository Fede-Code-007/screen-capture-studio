import { useEffect, useRef } from 'react'
import { Monitor } from 'lucide-react'

interface Props {
  stream: MediaStream | null
  recordingUrl: string | null
}

export function RecorderPreview({ stream, recordingUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // recordingUrl en las dependencias: el <video> en vivo se vuelve a montar
  // cuando se descarta una grabación, y hay que reasignarle el stream
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream, recordingUrl])

  if (recordingUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
        <video
          key={recordingUrl}
          src={`${recordingUrl}#t=0.001`}
          controls
          preload="auto"
          playsInline
          className="size-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="size-full object-contain"
      />
      {!stream && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Monitor className="size-10" />
          <p className="text-sm">Presioná Grabar para elegir qué pantalla compartir</p>
        </div>
      )}
    </div>
  )
}