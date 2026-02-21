import { Navigate } from 'react-router-dom'
import { useAuth } from '@/src/features/auth/hooks/useAuth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (!isLoading && !user) {
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
