import Axios from 'axios'

const signin = async (
  phone,
  password,
  setSessionUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    const res = await Axios({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: { phone, password },
    })

    setLoading(false)
    if (res.data) {
      setSessionUser(res.data)
    }
  } catch (err) {
    setLoading(false)
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
