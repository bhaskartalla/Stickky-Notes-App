import type { FakeDataType } from '@/types'
import Trash from '@/src/icons/Trash'
import { useEffect, useRef } from 'react'

const NoteCard = ({ note }: { note: FakeDataType }) => {
  // console.log('🚀 ~ NoteCard ~ note:', note)
  const body = JSON.parse(note.body)
  const position = JSON.parse(note.position)
  const colors = JSON.parse(note.colors)

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const autoGrow = (
    textareaRef: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    const { current } = textareaRef
    if (!current) return
    current.style.height = 'auto'
    current.style.height = current.scrollHeight + 'px'
  }

  useEffect(() => {
    autoGrow(textAreaRef)
  }, [])

  return (
    <div
      className='card'
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className='card-header'
        style={{ backgroundColor: colors.colorHeader }}
      >
        <Trash />
      </div>
      <div className='card-body'>
        <textarea
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
