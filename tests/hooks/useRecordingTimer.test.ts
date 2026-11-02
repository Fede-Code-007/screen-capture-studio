import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecordingTimer } from '@/hooks/useRecordingTimer'
import type { RecordingStatus } from '@/types/recorder.types'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

function setup(initial: RecordingStatus) {
  return renderHook(({ status }) => useRecordingTimer(status), {
    initialProps: { status: initial },
  })
}

describe('useRecordingTimer', () => {
  it('no cuenta mientras no se graba', () => {
    const { result } = setup('inactive')
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.seconds).toBe(0)
  })

  it('cuenta los segundos mientras graba', () => {
    const { result } = setup('recording')
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.seconds).toBe(3)
  })

  it('se frena en pausa y continúa al reanudar', () => {
    const { result, rerender } = setup('recording')

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    rerender({ status: 'paused' })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.seconds).toBe(2)

    rerender({ status: 'recording' })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.seconds).toBe(4)
  })

  it('reset vuelve a cero', () => {
    const { result } = setup('recording')
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    act(() => result.current.reset())
    expect(result.current.seconds).toBe(0)
  })
})