import { describe, expect, it } from 'vitest'
import { buildFileName, getFileExtension } from '@/utils/fileName'

describe('getFileExtension', () => {
  it('devuelve mp4 o webm según el tipo', () => {
    expect(getFileExtension('video/mp4;codecs=avc1')).toBe('mp4')
    expect(getFileExtension('video/webm;codecs=vp9,opus')).toBe('webm')
  })
})

describe('buildFileName', () => {
  it('arma el nombre con fecha, hora y extensión', () => {
    // Noviembre es el mes 10: en JavaScript los meses empiezan en 0
    const date = new Date(2026, 10, 2, 12, 50, 30)
    expect(buildFileName('video/webm', date)).toBe('grabacion-2026-11-02-12-50-30.webm')
    expect(buildFileName('video/mp4', date)).toBe('grabacion-2026-11-02-12-50-30.mp4')
  })
})