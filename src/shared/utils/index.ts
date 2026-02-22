import type { MousePointerPosType, ToastType } from '@/types'
import { FirebaseError } from 'firebase/app'
import type { RefObject } from 'react'

export const setNewOffset = (
  card: HTMLDivElement,
  mouseMoveDir: MousePointerPosType = { x: 0, y: 0 }
) => {
  return {
    x: Math.min(
      window.innerWidth - card.clientWidth,
      Math.max(0, card.offsetLeft - mouseMoveDir.x)
    ),
    y: Math.min(
      window.innerHeight - card.clientHeight,
      Math.max(0, card.offsetTop - mouseMoveDir.y)
    ),
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

  Array.from(document.querySelectorAll('[data-card]')).forEach((card) => {
    if (selectedCard === card) return
    const htmlCard = card as HTMLElement
    htmlCard.style.zIndex = `${highestZIndex - 1}`
  })
}

export const generateRandomString = (length = 20) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'

  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('')
}

export const STATUS = Object.freeze({
  SAVING: 'Saving',
  DELETING: 'Deleting',
  CREATING: 'Creating',
})

export const getToastErrorMessage = (error: unknown): ToastType => {
  if (error instanceof FirebaseError) {
    return { message: error.message, type: 'error' }
  } else if (error instanceof Error) {
    return { message: error.message, type: 'error' }
  } else {
    return { message: 'Unknown error occurred', type: 'error' }
  }
}

export const getRandomInt = (max = 4) => {
  return Math.floor(Math.random() * max)
}

// TODO: configure the custom error msgs
export const getErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password.'

    case 'auth/user-not-found':
      return 'User does not exist.'

    case 'auth/email-already-in-use':
      return 'Email already in use.'

    default:
      return 'Login failed. Please try again.'
  }
}
