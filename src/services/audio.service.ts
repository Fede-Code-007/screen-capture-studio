export interface Volumes {
  system: number // 1 = 100%
  mic: number
}

export interface RecordingSource {
  stream: MediaStream
  setSystemVolume: (value: number) => void
  setMicVolume: (value: number) => void
  setMicStream: (stream: MediaStream | null) => void
  close: () => void
}

/**
 * Arma el stream que se va a grabar: el video de la pantalla más una única
 * pista de audio mezclada. La pista existe siempre (silenciosa si no hay
 * fuentes), así el micrófono se puede conectar o desconectar en plena grabación.
 */
export function createRecordingStream(
  screenStream: MediaStream,
  micStream: MediaStream | null,
  volumes: Volumes = { system: 1, mic: 1 },
): RecordingSource {
  const audioContext = new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()

  const destination = audioContext.createMediaStreamDestination()

  // Audio del sistema (solo se define al compartir pantalla)
  const systemGain = audioContext.createGain()
  systemGain.gain.value = volumes.system
  systemGain.connect(destination)
  if (screenStream.getAudioTracks().length > 0) {
    audioContext.createMediaStreamSource(screenStream).connect(systemGain)
  }

  // Micrófono: el nodo de ganancia queda fijo y la fuente se intercambia
  const micGain = audioContext.createGain()
  micGain.gain.value = volumes.mic
  micGain.connect(destination)

  let micSource: MediaStreamAudioSourceNode | null = null

  const setMicStream = (stream: MediaStream | null) => {
    micSource?.disconnect()
    micSource = null

    if (stream && stream.getAudioTracks().length > 0) {
      micSource = audioContext.createMediaStreamSource(stream)
      micSource.connect(micGain)
    }
  }
  setMicStream(micStream)

  // setTargetAtTime suaviza el cambio y evita chasquidos
  const setVolume = (node: GainNode) => (value: number) => {
    node.gain.setTargetAtTime(value, audioContext.currentTime, 0.015)
  }

  return {
    stream: new MediaStream([
      ...screenStream.getVideoTracks(),
      ...destination.stream.getAudioTracks(),
    ]),
    setSystemVolume: setVolume(systemGain),
    setMicVolume: setVolume(micGain),
    setMicStream,
    close: () => {
      void audioContext.close()
    },
  }
}