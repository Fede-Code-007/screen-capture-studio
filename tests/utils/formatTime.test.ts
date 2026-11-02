import { describe, expect, it } from 'vitest'
import { formatTime } from '@/utils/formatTime'

describe('formatTime', () => {
  it('formatea como mm:ss', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(59)).toBe('00:59')
    expect(formatTime(65)).toBe('01:05')
  })

  it('incluye las horas cuando corresponde', () => {
    expect(formatTime(3661)).toBe('1:01:01')
  })
})