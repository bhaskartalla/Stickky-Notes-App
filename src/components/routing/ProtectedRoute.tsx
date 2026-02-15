import { NotesContext } from '@/src/context/NotesContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useContext(NotesContext)

  // if (loading) return null

  if (!loading && !user) {
    return (
      <Navigate
        to='/signin'
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
