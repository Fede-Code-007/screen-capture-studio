export interface RecordingSource {
  stream: MediaStream
  close: () => void
}

/**
 * Arma el stream que se va a grabar: el video de la pantalla
 * más una única pista de audio con todas las fuentes mezcladas.
 */
export function createRecordingStream(
  screenStream: MediaStream,
  micStream: MediaStream | null,
): RecordingSource {
  const videoTracks = screenStream.getVideoTracks()

  // Solo usamos las fuentes que realmente tienen audio
  const audioSources = [screenStream, micStream].filter(
    (s): s is MediaStream => s !== null && s.getAudioTracks().length > 0,
  )

  // Sin audio: grabamos solo el video
  if (audioSources.length === 0) {
    return { stream: new MediaStream(videoTracks), close: () => {} }
  }

  const audioContext = new AudioContext()
  const destination = audioContext.createMediaStreamDestination()

  audioSources.forEach((source) => {
    audioContext.createMediaStreamSource(source).connect(destination)
  })

  const stream = new MediaStream([
    ...videoTracks,
    ...destination.stream.getAudioTracks(),
  ])

  return {
    stream,
    close: () => {
      void audioContext.close()
    },
  }
}