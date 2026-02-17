import type { NoteDataType, MousePointerPosType } from '@/types'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  autoGrow,
  bodyParser,
  getToastErrorMessage,
  setNewOffset,
  setZIndex,
  STATUS,
} from '@/src/utils'
import { NotesContext } from '@/src/context/NotesContext'
import DeleteButton from '@/src/components/DeleteButton'
// import { dbFunctions } from '@/src/firebaseConfig/dbFunctions'
import styles from './styles.module.css'
import { updateNote } from '@/src/firebaseConfig/firestore'

type NoteCardProps = {
  note: NoteDataType
}

const NoteCard = ({ note }: NoteCardProps) => {
  const { setSelectedNote, setStatus, user, setToast } =
    useContext(NotesContext)

  const body = bodyParser(note.body)
  const colors = bodyParser(note.colors)
  const pointerStartPos = useRef<MousePointerPosType>({ x: 0, y: 0 })
  const [position, setPosition] = useState<MousePointerPosType>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition(bodyParser(note.position))
  }, [note.position])

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const keyUpTimer = useRef<number>(0)
  const isDragging = useRef<boolean>(false)

  const handlePointerDown = (
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

    setZIndex(cardRef)
    setSelectedNote(note)

    document.addEventListener('mousemove', handlePointerMove)
    document.addEventListener('mouseup', handlePointerUp)
    document.addEventListener('touchmove', handlePointerMove, {
      passive: false,
    })
    document.addEventListener('touchend', handlePointerUp)
  }

  const handlePointerMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return

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

    if (!cardRef.current) return

    const boundedOffset: MousePointerPosType = setNewOffset(
      cardRef.current,
      pointerMoveDir
    )
    setPosition(boundedOffset)
  }

  const handlePointerUp = async () => {
    if (!isDragging.current) return

    isDragging.current = false

    document.removeEventListener('mousemove', handlePointerMove)
    document.removeEventListener('mouseup', handlePointerUp)
    document.removeEventListener('touchmove', handlePointerMove)
    document.removeEventListener('touchend', handlePointerUp)

    if (!cardRef.current) return

    setStatus(STATUS.SAVING)
    saveData('position', JSON.stringify(setNewOffset(cardRef.current)))
  }

  const saveData = async (key: string, value: string) => {
    const payload = { [key]: value }
    try {
      await updateNote(user?.uid ?? '', note.$id, payload)
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
    setStatus('')
  }

  const handleOnKeyUp = () => {
    setStatus(STATUS.SAVING)
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current)
    }
    keyUpTimer.current = setTimeout(() => {
      saveData('body', textAreaRef.current?.value ?? '')
    }, 1000)
  }

  useEffect(() => {
    autoGrow(textAreaRef)
    setZIndex(cardRef)

    return () => {
      document.removeEventListener('mousemove', handlePointerMove)
      document.removeEventListener('mouseup', handlePointerUp)
      document.removeEventListener('touchmove', handlePointerMove)
      document.removeEventListener('touchend', handlePointerUp)
    }
  }, [])

  return (
    <div
      data-card
      ref={cardRef}
      className={styles.card}
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        id='card-header'
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className={styles.card_header}
        style={{
          backgroundColor: colors.colorHeader,
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        <DeleteButton noteId={note.$id} />
      </div>
      <div className={styles.card_body}>
        <textarea
          onKeyUp={handleOnKeyUp}
          onFocus={() => {
            setZIndex(cardRef)
            setSelectedNote(note)
          }}
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          defaultValue={body}
          onInput={() => autoGrow(textAreaRef)}
        ></textarea>
      </div>
    </div>
  )
}

export default NoteCard
