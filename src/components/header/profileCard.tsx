import styles from './styles.module.css'
import { logOut } from '@/src/firebaseConfig/auth'
import { useContext } from 'react'
import { NotesContext } from '@/src/context/NotesContext'
import { getToastErrorMessage } from '@/src/utils'

type ProfileCardProps = {
  isPopUpOpen: boolean
}

const ProfileCard = ({ isPopUpOpen }: ProfileCardProps) => {
  const { user, setToast } = useContext(NotesContext)

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (error) {
      setToast(getToastErrorMessage(error))
    }
  }

  if (!user) return null

  return (
    <div className={`${styles.user_popup} ${isPopUpOpen ? styles.active : ''}`}>
      <div className={styles.popup_header}>
        {user.photoURL ? (
          <img
            className={styles.profile_avatar}
            src={user.photoURL}
            alt='User Profile'
            referrerPolicy='no-referrer'
            loading='lazy'
          />
        ) : (
          <span className={styles.profile_avatar}>
            {(user.displayName ?? '')
              .split(' ')
              .map((name: string) => name[0]?.toUpperCase())
              .join('')}
          </span>
        )}
        <div className={styles.profile_name}>{user.displayName}</div>
      </div>

      <div className={styles.popup_body}>
        <div className={styles.user_detail}>
          <span className={styles.detail_label}>Email:</span>
          <span className={styles.detail_value}>{user.email}</span>
        </div>

        <div className={styles.popup_divider}></div>

        <button
          className={styles.logout_btn}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
export default ProfileCard
