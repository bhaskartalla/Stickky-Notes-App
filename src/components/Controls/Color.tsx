import type { ColorType } from '@/types'
import { useContext } from 'react'
import styles from './styles.module.css'
import { NotesContext } from '@/src/context/NotesContext'
import { getToastErrorMessage, STATUS } from '@/src/utils'
// import { dbFunctions } from '@/src/firebaseConfig/dbFunctions'
import { updateNote } from '@/src/firebaseConfig/firestore'

const Color = ({ color }: { color: ColorType }) => {
  const { selectedNote, setNotes, setStatus, user, setToast } =
    useContext(NotesContext)

  const changeColor = async () => {
    if (selectedNote === null) return
    try {
      setStatus(STATUS.SAVING)
      const payload = { colors: JSON.stringify(color) }
      await updateNote(user?.uid ?? '', selectedNote.$id, payload)
      setNotes((prev) => {
        const curretIndex = prev.findIndex(
          (note) => note.$id === selectedNote.$id
        )
        const updatedNote = {
          ...prev[curretIndex],
          colors: color,
        }

        const notes = [...prev]
        notes[curretIndex] = updatedNote
        return notes
      })
      // await dbFunctions.notes.updateDocument(selectedNote.$id, payload)
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
    setStatus('')
  }

  return (
    <div
      className={styles.color}
      onClick={changeColor}
      style={{ backgroundColor: color.colorBody }}
    ></div>
  )
}

export default Color
