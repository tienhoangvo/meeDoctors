import Axios from 'axios'

const create = async (
  user,
  setNewUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    let res = await Axios({
      url: '/api/users',
      method: 'POST',
      data: user,
    })

    console.log(user)

    setNewUser(res.data.user)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    console.log(err.response)
    setError(err.response)
  }
}

const list = async (
  cancelToken,
  setUsers = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    let res = await Axios({
      url: '/api/users',
      method: 'GET',
      cancelToken,
    })
    console.log(res.data.users)
    setLoading(false)
    setUsers(res.data.users)
  } catch (err) {
    setLoading(false)
    if (err instanceof Axios.Cancel) {
    } else {
      console.log('FROM LIST', err)
      setError(err.response)
    }
  }
}

const read = async (
  cancelToken,
  userId,
  setUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    let res = await Axios({
      url: `/api/users/${userId}`,
      method: 'GET',
      cancelToken,
    })

    console.log('res', res)

    setUser(res.data.user)
    setLoading(false)
  } catch (err) {
    console.log(err)
    setError(err.response)
  }
}

const update = async (
  userId,
  user,
  setUser = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    let res = await Axios({
      url: `/api/users/${userId}`,
      method: 'PATCH',
      data: user,
    })

    setUser(res.data.user)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    setError(err.response)
  }
}

const remove = async (
  userId,
  setStatus = (f) => f,
  setLoading = (f) => f,
  setError = (f) => f
) => {
  try {
    setLoading(true)
    let res = await Axios({
      url: `/api/users/${userId}`,
      method: 'DELETE',
    })
    console.log('From delete', res)
    setStatus(true)
    setLoading(false)
  } catch (err) {
    setLoading(false)
    setError(err.response)
  }
}

export { create, list, read, update, remove }
