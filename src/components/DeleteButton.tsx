import type { NoteDataType } from '@/types'
import Trash from '../icons/Trash'
import { db } from '../apppwrite/databases'

type DeleteButtonProps = {
  noteId: string
  setNotes: React.Dispatch<React.SetStateAction<NoteDataType[]>>
}

const DeleteButton = ({ noteId, setNotes }: DeleteButtonProps) => {
  const handleDelete = async () => {
    await db.notes.deleteRow(noteId)
    setNotes((prev) => prev.filter(({ $id }) => $id !== noteId))
  }

  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  )
}
export default DeleteButton
