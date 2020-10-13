import React, { useEffect, useState } from 'react'
import Axios from 'axios'

const useFetch = ({
  url,
  httpMethod = 'GET',
  bodyData,
}) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    console.log(url)
    if (!url) return

    Axios({
      url,
      method: httpMethod,
      data: bodyData,
    })
      .then((data) => {
        console.log('DATA USERS', data), setData(data)
      })
      .catch(setError)
      .then(() => setLoading(false))
  }, [url])

  return [data, loading, error]
}

export default useFetch
