import type { NoteDataType, ToastType } from '@/types'
import type { User } from 'firebase/auth'
import { createContext, type Dispatch, type SetStateAction } from 'react'

type NotesContextType = {
  notes: NoteDataType[]
  setNotes: Dispatch<SetStateAction<NoteDataType[]>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  selectedNote: NoteDataType
  setSelectedNote: Dispatch<SetStateAction<NoteDataType>>
  status: string
  setStatus: Dispatch<SetStateAction<string>>
  user: User | null
  toast: ToastType
  setToast: Dispatch<SetStateAction<ToastType>>
}

export const NotesContext = createContext({
  notes: [],
  setNotes: () => {},
  loading: false,
  setLoading: () => {},
  selectedNote: null,
  setSelectedNote: () => {},
  status: '',
  setStatus: () => {},
  user: null,
  toast: {} as ToastType,
  setToast: () => {},
} as NotesContextType)
