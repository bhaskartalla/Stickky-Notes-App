import NoteCard from '@/src/components/NoteCard'
import { useEffect, useState } from 'react'
import type { NoteDataType } from '@/types'
import { db } from '@/src/apppwrite/databases'

const NotesPage = () => {
  const [notes, setNotes] = useState<NoteDataType[]>([])

  useEffect(() => {
    const init = async () => {
      try {
        const response = await db.notes.listRows()

        setNotes(
          response.rows.map((row) => ({
            $id: row.$id,
            body: row.body,
            colors: row.colors,
            position: row.position,
          }))
        )
      } catch (error) {
        console.log('🚀 ~ init ~ error:', error)
      }
    }
    init()
  }, [])

  return (
    <div>
      {notes.map((note: NoteDataType) => (
        <NoteCard
          key={note.$id}
          note={note}
          setNotes={setNotes}
        />
      ))}
    </div>
  )
}

export default NotesPage
