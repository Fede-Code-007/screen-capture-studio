import { describe, expect, it } from 'vitest'
import { formatFileSize } from '@/utils/formatFileSize'

describe('formatFileSize', () => {
  it('usa la unidad adecuada', () => {
    expect(formatFileSize(500)).toBe('500 B')
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1024 ** 2)).toBe('1.0 MB')
    expect(formatFileSize(1024 ** 3)).toBe('1.00 GB')
  })
})