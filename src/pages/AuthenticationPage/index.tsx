import { lazy, useState, type ChangeEvent } from 'react'
import styles from './styles.module.css'
import { signIn, signInWithGoogle, signUp } from '@/src/firebaseConfig/auth'
import { FirebaseError } from 'firebase/app'

const SignIn = lazy(() => import('./SignIn'))
const SignUp = lazy(() => import('./SignUp'))

const getErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password.'

    case 'auth/user-not-found':
      return 'User does not exist.'

    case 'auth/email-already-in-use':
      return 'Email already in use.'

    default:
      return 'Login failed. Please try again.'
  }
}

const AuthenticationPage = () => {
  const [isSignInView, setIsSignInView] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const toggleLoginView = () => setIsSignInView((prev) => !prev)

  const [{ email, password, confirmPassword }, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    try {
      await signIn(email, password)
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error))
      }
    }
  }

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error))
      }
    }
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters')
      return
    }

    try {
      await signUp(email, password)
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error))
      }
    }
  }

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_card}>
        <div className={styles.auth_body}>
          <div
            id='errorMessage'
            className={styles.error_message}
            style={{
              display: errorMessage ? 'block' : 'none',
            }}
          >
            {errorMessage}
          </div>

          {isSignInView ? (
            <SignIn
              credentials={{ email, password, confirmPassword }}
              handleChange={handleChange}
              handleSignUpView={toggleLoginView}
              handleGoogleSignIn={handleGoogleAuth}
              handleLogin={handleLogin}
            />
          ) : (
            <SignUp
              credentials={{ email, password, confirmPassword }}
              handleChange={handleChange}
              handleSignInView={toggleLoginView}
              handleGoogleSignUp={handleGoogleAuth}
              handleRegister={handleRegister}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default AuthenticationPage
