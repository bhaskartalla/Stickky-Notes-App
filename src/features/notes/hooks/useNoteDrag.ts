import { useRef, useState, useCallback } from 'react'
import type { MousePointerPosType } from '@/types'
import { setNewOffset } from '@/src/shared/utils'

export const useNoteDrag = (
  cardRef: React.RefObject<HTMLDivElement | null>,
  initialPosition: MousePointerPosType,
  onDragEnd: (position: MousePointerPosType) => void
) => {
  const [position, setPosition] = useState(initialPosition)
  const pointerStartPos = useRef<MousePointerPosType>({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const handlePointerMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !cardRef.current) return

      if (event.type === 'touchmove') {
        event.preventDefault()
      }

      const clientX =
        'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY =
        'touches' in event ? event.touches[0].clientY : event.clientY

      const pointerMoveDir = {
        x: pointerStartPos.current.x - clientX,
        y: pointerStartPos.current.y - clientY,
      }

      pointerStartPos.current.x = clientX
      pointerStartPos.current.y = clientY

      const boundedOffset = setNewOffset(cardRef.current, pointerMoveDir)
      setPosition(boundedOffset)
    },
    [cardRef]
  )

  const handlePointerUp = useCallback(async () => {
    if (!isDragging.current || !cardRef.current) return

    isDragging.current = false

    document.removeEventListener('mousemove', handlePointerMove)
    // eslint-disable-next-line react-hooks/immutability
    document.removeEventListener('mouseup', handlePointerUp)
    document.removeEventListener('touchmove', handlePointerMove)
    document.removeEventListener('touchend', handlePointerUp)

    const finalPosition = setNewOffset(cardRef.current)
    onDragEnd(finalPosition)
  }, [cardRef, handlePointerMove, onDragEnd])

  const handlePointerDown = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      const target = event.target as HTMLElement
      if (target.id !== 'card-header') return

      event.preventDefault()

      const clientX =
        'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY =
        'touches' in event ? event.touches[0].clientY : event.clientY

      pointerStartPos.current.x = clientX
      pointerStartPos.current.y = clientY
      isDragging.current = true

      document.addEventListener('mousemove', handlePointerMove)
      document.addEventListener('mouseup', handlePointerUp)
      document.addEventListener('touchmove', handlePointerMove, {
        passive: false,
      })
      document.addEventListener('touchend', handlePointerUp)
    },
    [handlePointerMove, handlePointerUp]
  )

  return {
    position,
    handlePointerDown,
  }
}
