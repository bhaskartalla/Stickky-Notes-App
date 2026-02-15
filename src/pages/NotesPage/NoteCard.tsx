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
  const body = bodyParser(note.body)
  const colors = bodyParser(note.colors)
  const mouseStartPos = useRef<MousePointerPosType>({ x: 0, y: 0 })
  const { setSelectedNote, setStatus, user, setToast } =
    useContext(NotesContext)

  const [position, setPosition] = useState<MousePointerPosType>(
    bodyParser(note.position)
  )
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const keyUpTimer = useRef<number>(0)

  useEffect(() => {
    autoGrow(textAreaRef)
    setZIndex(cardRef)
  }, [])

  const mouseMove = (event: MouseEvent) => {
    const mouseMoveDir = {
      x: mouseStartPos.current.x - event.clientX,
      y: mouseStartPos.current.y - event.clientY,
    }

    mouseStartPos.current.x = event.clientX
    mouseStartPos.current.y = event.clientY

    if (!cardRef.current) return

    const boundedOffset: MousePointerPosType = setNewOffset(
      cardRef.current,
      mouseMoveDir
    )

    setPosition(boundedOffset)
  }

  const mouseUp = async () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)

    if (!cardRef.current) return
    setStatus(STATUS.SAVING)
    saveData('position', JSON.stringify(setNewOffset(cardRef.current)))
  }

  const pointerStartPos = useRef<MousePointerPosType>({ x: 0, y: 0 })

  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.id !== 'card-header') return

    pointerStartPos.current.x = event.clientX
    pointerStartPos.current.y = event.clientY

    setZIndex(cardRef)
    setSelectedNote(note)

    document.addEventListener('pointermove', pointerMove)
    document.addEventListener('pointerup', pointerUp)
  }

  const pointerMove = (event: PointerEvent) => {
    const moveDir = {
      x: pointerStartPos.current.x - event.clientX,
      y: pointerStartPos.current.y - event.clientY,
    }

    pointerStartPos.current.x = event.clientX
    pointerStartPos.current.y = event.clientY

    if (!cardRef.current) return

    const boundedOffset = setNewOffset(cardRef.current, moveDir)
    setPosition(boundedOffset)
  }

  const pointerUp = async () => {
    document.removeEventListener('pointermove', pointerMove)
    document.removeEventListener('pointerup', pointerUp)

    if (!cardRef.current) return

    setStatus(STATUS.SAVING)
    saveData('position', JSON.stringify(setNewOffset(cardRef.current)))
  }

  const saveData = async (key: string, value: string) => {
    const payload = { [key]: value }
    try {
      await updateNote(user?.uid ?? '', note.$id, payload)
      // await dbFunctions.notes.updateDocument(note.$id, payload)
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
        // onMouseDown={mouseDown}
        onPointerDown={pointerDown}
        className={styles.card_header}
        style={{ backgroundColor: colors.colorHeader }}
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
