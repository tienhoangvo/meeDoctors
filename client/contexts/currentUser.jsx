import React, {
  createContext,
  useContext,
  useState,
} from 'react'
import { isAuthenticated } from '../auth/authHelper'

const currentUserContext = createContext()

export const useCurrentUser = () =>
  useContext(currentUserContext)

export const CurrentUserProvider = ({
  children,
  serverUser,
}) => {
  const [currentUser, setCurrentUser] = useState(
    isAuthenticated().user || serverUser
  )

  return (
    <currentUserContext.Provider
      value={{ currentUser, setCurrentUser }}
    >
      {children}
    </currentUserContext.Provider>
  )
}
