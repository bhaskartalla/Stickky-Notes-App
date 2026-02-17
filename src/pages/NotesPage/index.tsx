import { lazy, useContext } from 'react'
import type { NoteDataType } from '@/types'
import { NotesContext } from '@/src/context/NotesContext'
import Controls from '@/src/components/controls'
import styles from './styles.module.css'

const NoteCard = lazy(() => import('./NoteCard'))

const NotesPage = () => {
  const { notes } = useContext(NotesContext)

  return (
    <div
      id='note-canvas'
      className={styles.notes_canvas}
    >
      {notes.map((note: NoteDataType, index: number) => (
        <NoteCard
          key={`${note.$id}_${index}`}
          note={note}
        />
      ))}
      <Controls />
    </div>
  )
}

export default NotesPage
