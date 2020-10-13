import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { authenticate } from './authHelper'
import { signin } from './apiAuth'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  CircularProgress,
  makeStyles,
} from '@material-ui/core'

import { Error } from '@material-ui/icons'
import { useCurrentUser } from '../contexts/currentUser'
import useInput from '../hooks/useInput'

const useStyles = makeStyles((theme) => ({
  card: {
    width: '600px',
    margin: 'auto',
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: '16px',
  },
  title: {
    color: theme.palette.openTitle,
  },

  textField: {
    width: '400px',
  },

  errorMessage: {
    width: '400px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,
  },

  cardActions: {
    width: '400px',
  },

  wrapperAction: {
    position: 'relative',
    width: '100%',
  },

  buttonProgress: {
    color: 'success',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

const Signin = ({ location }) => {
  const classes = useStyles()
  const [sessionUser, setSessionUser] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [phoneProps, setPhone] = useInput('')
  const [passwordProps, setPassword] = useInput('')

  const {
    currentUser,
    setCurrentUser,
  } = useCurrentUser()

  const onSubmit = (event) => {
    console.log(event)
    console.log(phoneProps, passwordProps)
    signin(
      phoneProps.value,
      passwordProps.value,
      setSessionUser,
      setLoading,
      setError
    )
  }
  const { from } = location.state || {
    from: { pathname: '/' },
  }

  if (sessionUser) {
    console.log('SessionUser', sessionUser)
    setCurrentUser(sessionUser.user)
    console.log('currentUser', currentUser)
    // return <Redirect to="/users" />
    return authenticate(sessionUser, () => (
      <Redirect to={from} />
    ))
  }

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography variant="h6">Sign In</Typography>
        <TextField
          id="phone"
          type="phone"
          label="Phone"
          {...phoneProps}
          margin="normal"
          className={classes.textField}
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          {...passwordProps}
          margin="normal"
          className={classes.textField}
        />
        <br />
        {error && (
          <Typography
            component="p"
            className={classes.errorMessage}
          >
            <Error />
            {error.data.message}
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.wrapperAction}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={onSubmit}
            fullWidth
          >
            Submit
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              className={classes.buttonProgress}
            />
          )}
        </div>
      </CardActions>
    </Card>
  )
}

export default Signin
