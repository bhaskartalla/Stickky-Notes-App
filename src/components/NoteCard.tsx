import type { NoteDataType, MousePointerPosType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { autoGrow, bodyParser, setNewOffset, setZIndex } from '../utils'
import { db } from '../apppwrite/databases'
import Spinner from '../icons/Spinner'
import DeleteButton from './DeleteButton'

type NoteCardProps = {
  note: NoteDataType
  setNotes: React.Dispatch<React.SetStateAction<NoteDataType[]>>
}

const NoteCard = ({ note, setNotes }: NoteCardProps) => {
  const body = bodyParser(note.body)
  const colors = bodyParser(note.colors)
  const mouseStartPos = useRef<MousePointerPosType>({ x: 0, y: 0 })

  const [saving, setSaving] = useState(false)

  const [position, setPosition] = useState<MousePointerPosType>(
    bodyParser(note.position)
  )
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const keyUpTimer = useRef<number>(0)

  useEffect(() => {
    autoGrow(textAreaRef)
  }, [])

  const mouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.className !== 'card-header') return

    mouseStartPos.current.x = event.clientX
    mouseStartPos.current.y = event.clientY

    setZIndex(cardRef)

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
  }

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
    saveData('position', JSON.stringify(setNewOffset(cardRef.current)))
  }

  const saveData = async (key: string, value: string) => {
    const payload = { [key]: value }
    try {
      await db.notes.updateRow(note.$id, payload)
    } catch (error) {
      console.error('🚀 ~ saveData ~ error:', error)
    }
    setSaving(false)
  }

  const handleOnKeyUp = () => {
    setSaving(true)

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current)
    }

    keyUpTimer.current = setTimeout(() => {
      saveData('body', textAreaRef.current?.value ?? '')
    }, 1000)
  }

  return (
    <div
      ref={cardRef}
      className='card'
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className='card-header'
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton
          noteId={note.$id}
          setNotes={setNotes}
        />
        {saving && (
          <div className='card-saving'>
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className='card-body'>
        <textarea
          onKeyUp={handleOnKeyUp}
          onFocus={() => setZIndex(cardRef)}
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
