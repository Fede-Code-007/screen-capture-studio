import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRecordingStream } from '@/services/audio.service'

// MediaStream mínimo: lo justo para lo que usa el servicio
class FakeMediaStream {
  constructor(private tracks: unknown[] = []) {}
  getVideoTracks() {
    return this.tracks
  }
  getAudioTracks() {
    return []
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('createRecordingStream', () => {
  it('sin fuentes de audio graba solo el video y no crea un AudioContext', () => {
    const audioContext = vi.fn()
    vi.stubGlobal('MediaStream', FakeMediaStream)
    vi.stubGlobal('AudioContext', audioContext)

    const screen = new FakeMediaStream(['pista-de-video']) as unknown as MediaStream
    const source = createRecordingStream(screen, null)

    expect(source.stream.getVideoTracks()).toEqual(['pista-de-video'])
    expect(source.stream.getAudioTracks()).toHaveLength(0)
    expect(audioContext).not.toHaveBeenCalled()
  })
})