import type { NoteDataType, MousePointerPosType } from '@/types'
import { useEffect, useRef } from 'react'
import {
  autoGrow,
  getToastErrorMessage,
  setZIndex,
  STATUS,
} from '@/src/shared/utils'
import { bodyParser } from '@/src/shared/utils/bodyParser'
import styles from './Notes.module.css'
import { useNotes } from '../hooks/useNotes'
import { useAuth } from '@/src/features/auth/hooks/useAuth'
import DeleteButton from './DeleteButton'
import { notesService } from '../notes.service'
import { useNoteDrag } from '../hooks/useNoteDrag'

type NoteCardProps = {
  note: NoteDataType
}

const NoteCard = ({ note }: NoteCardProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const keyUpTimer = useRef<number>(0)

  const body = bodyParser(note.body)
  const colors = bodyParser(note.colors)

  useEffect(() => {
    autoGrow(textAreaRef)
    setZIndex(cardRef)
  }, [])

  const saveData = async (key: string, value: string) => {
    const payload = { [key]: value }
    try {
      await notesService.updateNote(user?.uid ?? '', note.id, payload)
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
    setStatus('')
  }

  const handleDragEnd = async (position: MousePointerPosType) => {
    setStatus(STATUS.SAVING)
    await saveData('position', JSON.stringify(position))
  }

  const { setSelectedNote, setStatus, setToast } = useNotes()
  const { user } = useAuth()
  const { position, handlePointerDown } = useNoteDrag(
    cardRef,
    bodyParser(note.position),
    handleDragEnd
  )

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
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className={styles.card_header}
        style={{
          backgroundColor: colors.colorHeader,
          touchAction: 'none',
          cursor: 'grab',
        }}
      >
        <DeleteButton noteId={note.id} />
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
