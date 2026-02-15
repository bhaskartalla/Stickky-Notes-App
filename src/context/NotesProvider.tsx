import type { NoteDataType, ToastType } from '@/types'
import { useEffect, useState, type ReactNode } from 'react'
import Spinner from '@/src/assets/icons/Spinner'
import { NotesContext } from './NotesContext'
import { observeAuthState } from '../firebaseConfig/auth'
import type { User } from 'firebase/auth'
import { getUserNotes } from '../firebaseConfig/firestore'
import { getToastErrorMessage } from '../utils'

const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<NoteDataType[]>([])
  const [selectedNote, setSelectedNote] = useState<NoteDataType>(null)
  const [status, setStatus] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [toast, setToast] = useState<ToastType>({} as ToastType)

  const fetchUserNotes = async (uid: string) => {
    try {
      const notes = await getUserNotes(uid)
      setNotes(notes.map((note) => ({ ...note, $id: note.id })))
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
  }

  useEffect(() => {
    const unsubscribe = observeAuthState(async (user: User | null) => {
      setUser(user)
      await fetchUserNotes(user?.uid ?? '')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        loading,
        setLoading,
        selectedNote,
        setSelectedNote,
        status,
        setStatus,
        user,
        toast,
        setToast,
      }}
    >
      <div id='app'>
        {loading && (
          <div className='main-spinner'>
            <Spinner size='100' />
          </div>
        )}
        {children}
      </div>
    </NotesContext.Provider>
  )
}

export default NotesProvider
