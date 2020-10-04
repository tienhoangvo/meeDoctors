import React, { useState } from 'react'
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

import { Redirect } from 'react-router-dom'
import {
  isAuthenticated,
  authenticate,
} from '../auth/authHelper'
import { update } from './apiUser'
import { useCurrentUser } from '../contexts/currentUser'

const useStyles = makeStyles((theme) => ({
  card: {
    width: '600px',
    margin: 'auto',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: '16px',
  },

  textField: {
    width: '400px',
  },

  errorMessage: {
    width: '400px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary.main,

    '& > *:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },

  wrapperAction: {
    position: 'relative',
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

const EditProfile = ({ match }) => {
  const classes = useStyles()
  const {
    currentUser,
    setCurrentUser,
  } = useCurrentUser()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [email, setEmail] = useState(currentUser.email)
  const [name, setName] = useState(currentUser.name)
  const [password, setPassword] = useState(
    currentUser.password
  )

  const onSubmit = (event) => {
    update(
      match.params.userId,
      { email, password, name },
      setUser,
      setLoading,
      setError
    )
  }

  if (user) {
    setCurrentUser(user)
    return authenticate(
      { ...currentUser, user },
      () => <Redirect to={`/user/${user._id}`} />
    )
  }

  return (
    <>
      {currentUser && (
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6">
              Edit Profile
            </Typography>
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              margin="normal"
              className={classes.textField}
            />
            <br />
            <TextField
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              margin="normal"
              className={classes.textField}
            />
            <br />
            <TextField
              id="password"
              type="password"
              label="Password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              margin="normal"
              className={classes.textField}
            />
            <br />
            {error && (
              <Typography
                component="p"
                color="error"
                className={classes.errorMessage}
              >
                <Error />
                <span>{error.data.message}</span>
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default EditProfile
