import Axios from 'axios'

const signin = async (
  email,
  password,
  setCurrentUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    const res = await Axios({
      method: 'POST',
      url: '/api/auth/login',
      data: { email, password },
    })

    console.log('Log in token', res.data)
    setLoading(false)
    if (res.data) {
      setCurrentUser(res.data)
    }
  } catch (err) {
    setLoading(false)
    console.log(err.response)
    setError(err.response)
  }
}

const signup = async (
  user,
  setNewUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    const res = await Axios({
      method: 'POST',
      url: '/api/auth/signup',
      data: user,
    })

    setLoading(false)
    setNewUser(res.data.user)
  } catch (err) {
    setError(err)
  }
}

const loggout = async (
  setLoggedout = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    const res = await Axios({
      method: 'GET',
      url: '/api/auth/logout',
    })
    setLoggedout(true)
    setLoading(false)
  } catch (err) {
    setError(err)
  }
}

export { loggout, signup, signin }
