import { loggout } from './apiAuth'

const authenticate = (currentUser, cb) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(
      'currentUser',
      JSON.stringify(currentUser)
    )
  }
  return cb()
}

const isAuthenticated = () => {
  if (typeof window == 'undefined') return false

  if (sessionStorage.getItem('currentUser'))
    return JSON.parse(
      sessionStorage.getItem('currentUser')
    )
  else return false
}

const clearJWT = async (cb) => {
  if (typeof window !== 'undefined')
    sessionStorage.removeItem('currentUser')
  cb()

  await loggout()
}

export { authenticate, isAuthenticated, clearJWT }
