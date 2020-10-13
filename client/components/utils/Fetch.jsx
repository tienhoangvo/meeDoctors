import React from 'react'
import useFetch from '../../hooks/useFetch'
import { LinearProgress } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

const Fetch = ({
  url,
  renderSuccess,
  loadingFallback = <LinearProgress />,
  renderError = (error) => {
    return (
      <Alert severity="error">
        <AlertTitle>
          Error: {error.response.data.status}
        </AlertTitle>
        {error.response.data.message}
      </Alert>
    )
  },
}) => {
  const [data, loading, error] = useFetch({ url })
  console.log('Error', error)
  console.log('data', data)
  console.log('Loading', loading)
  if (data) return renderSuccess({ data })
  if (loading) return loadingFallback
  if (error) return renderError(error)
}

export default Fetch
