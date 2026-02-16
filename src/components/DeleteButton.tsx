import { useContext } from 'react'
import Trash from '@/src/assets/icons/Trash'
import { NotesContext } from '@/src/context/NotesContext'
import { getToastErrorMessage, STATUS } from '@/src/utils'
import { deleteNote } from '../firebaseConfig/firestore'
// import { dbFunctions } from '@/src/firebaseConfig/dbFunctions'

type DeleteButtonProps = {
  noteId: string
}

const DeleteButton = ({ noteId }: DeleteButtonProps) => {
  const { setNotes, setStatus, user, setToast, setSelectedNote } =
    useContext(NotesContext)

  const handleDelete = async () => {
    try {
      setStatus(STATUS.DELETING)
      await deleteNote(user?.uid ?? '', noteId)
      // await dbFunctions.notes.deleteDocument(noteId)
      setNotes((prev) => {
        const updatedNotes = prev.filter(({ $id }) => $id !== noteId)
        setSelectedNote(updatedNotes.length ? updatedNotes[0] : null)
        return updatedNotes
      })
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
    setStatus('')
  }

  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  )
}
export default DeleteButton
