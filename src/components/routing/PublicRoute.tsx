import { NotesContext } from '@/src/context/NotesContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(NotesContext)

  if (loading) return null

  if (user) {
    return (
      <Navigate
        to='/'
        replace
      />
    )
  }

  return <>{children}</>
}

export default PublicRoute
