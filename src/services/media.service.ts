export async function getScreenStream(withSystemAudio: boolean): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 30 },
    audio: withSystemAudio
      ? {
          // Para audio del sistema conviene no procesarlo como si fuera voz
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      : false,
  })
}

export async function getMicrophoneStream(deviceId?: string): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: deviceId ? { deviceId: { exact: deviceId } } : true,
    video: false,
  })
}

export async function listAudioInputs(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter((device) => device.kind === 'audioinput')
}

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop())
}