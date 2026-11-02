import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSupportedMimeType } from '@/utils/getSupportedMimeType'

afterEach(() => vi.unstubAllGlobals())

describe('getSupportedMimeType', () => {
  it('prefiere MP4 cuando el navegador lo soporta', () => {
    vi.stubGlobal('MediaRecorder', { isTypeSupported: () => true })
    expect(getSupportedMimeType()).toBe('video/mp4;codecs=avc1.64003E,mp4a.40.2')
  })

  it('cae a WebM cuando no hay MP4 (por ejemplo, Firefox)', () => {
    vi.stubGlobal('MediaRecorder', {
      isTypeSupported: (type: string) => type.startsWith('video/webm'),
    })
    expect(getSupportedMimeType()).toBe('video/webm;codecs=vp9,opus')
  })

  it('devuelve undefined si no soporta ninguno', () => {
    vi.stubGlobal('MediaRecorder', { isTypeSupported: () => false })
    expect(getSupportedMimeType()).toBeUndefined()
  })
})