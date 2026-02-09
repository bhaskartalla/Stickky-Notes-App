/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { MousePointerPosType } from '@/types'
import type { RefObject } from 'react'

export const setNewOffset = (
  card: HTMLDivElement,
  mouseMoveDir: MousePointerPosType = { x: 0, y: 0 }
) => {
  return {
    x: Math.max(0, card.offsetLeft - mouseMoveDir.x),
    y: Math.max(0, card.offsetTop - mouseMoveDir.y),
  }
}

export const autoGrow = (
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) => {
  const { current } = textareaRef
  if (!current) return
  current.style.height = 'auto'
  current.style.height = current.scrollHeight + 'px'
}

export const setZIndex = (
  selectedCardRef: RefObject<HTMLDivElement | null>
) => {
  if (!selectedCardRef.current) return
  const selectedCard = selectedCardRef.current

  const highestZIndex = 999
  selectedCard.style.zIndex = `${highestZIndex}`

  Array.from(document.getElementsByClassName('card')).forEach((card) => {
    if (selectedCard === card) return
    const htmlCard = card as HTMLElement
    htmlCard.style.zIndex = `${highestZIndex - 1}`
  })
}

export const bodyParser = (value: any) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
