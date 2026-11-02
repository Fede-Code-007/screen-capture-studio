import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob } from '@/services/download.service'

beforeEach(() => {
  vi.useFakeTimers()
  // jsdom no implementa estas funciones, así que las definimos
  URL.createObjectURL = vi.fn(() => 'blob:fake-url')
  URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('downloadBlob', () => {
  it('dispara la descarga con el nombre indicado y limpia después', () => {
    let downloadedAs = ''
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadedAs = this.download
      })

    downloadBlob(new Blob(['contenido']), 'video.mp4')

    expect(click).toHaveBeenCalledOnce()
    expect(downloadedAs).toBe('video.mp4')
    expect(document.querySelector('a')).toBeNull() // el enlace temporal se quitó

    vi.advanceTimersByTime(1000)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake-url')
  })
})