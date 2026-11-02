export async function getScreenStream(withSystemAudio: boolean): Promise<MediaStream> {
  const options = {
    video: { frameRate: 30 },
    audio: withSystemAudio
      ? {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      : false,
    // Pista para Chrome: ofrecer el audio del sistema en el selector
    ...(withSystemAudio ? { systemAudio: 'include' } : {}),
  } as DisplayMediaStreamOptions

  return navigator.mediaDevices.getDisplayMedia(options)
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