import type { NoteDataType, ToastType } from '@/types'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import Spinner from '@/src/assets/icons/Spinner'
import { NotesContext } from './NotesContext'
import { observeAuthState } from '../firebaseConfig/auth'
import type { Unsubscribe, User } from 'firebase/auth'
import { getUserNotes } from '../firebaseConfig/firestore'
import { getToastErrorMessage } from '../utils'
import { db } from '../firebaseConfig/config'
import { collection, onSnapshot, query } from 'firebase/firestore'

const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState<NoteDataType[]>([])
  const [selectedNote, setSelectedNote] = useState<NoteDataType>(null)
  const [status, setStatus] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [toast, setToast] = useState<ToastType>({} as ToastType)

  const realtimeUnsubscribeRef = useRef<Unsubscribe | null>(null)

  const subscribeToUserNotes = (uid: string): Unsubscribe => {
    const notesRef = collection(db, 'users', uid, 'notes')

    return onSnapshot(
      notesRef,
      (snapshot) => {
        const updatedNotes = snapshot.docs.map((doc) => ({
          ...doc.data(),
          $id: doc.id,
        }))
        setNotes(updatedNotes)
      },
      (error) => {
        setToast(getToastErrorMessage(error))
      }
    )
  }

  useEffect(() => {
    const unsubscribeAuth = observeAuthState((authUser: User | null) => {
      setUser(authUser)

      realtimeUnsubscribeRef.current?.()
      realtimeUnsubscribeRef.current = null

      if (!authUser) {
        setNotes([])
        return
      }

      realtimeUnsubscribeRef.current = subscribeToUserNotes(authUser.uid)
      setLoading(false)
    })

    return () => {
      unsubscribeAuth()
      realtimeUnsubscribeRef.current?.()
    }
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
