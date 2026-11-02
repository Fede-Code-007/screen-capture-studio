import { useEffect, useRef } from 'react'
import { Monitor } from 'lucide-react'

interface Props {
  stream: MediaStream | null
}

export function RecorderPreview({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

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
          <p className="text-sm">Todavía no estás compartiendo pantalla</p>
        </div>
      )}
    </div>
  )
}