import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { create } from '../user/apiUser'

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  makeStyles,
} from '@material-ui/core'

import { Error } from '@material-ui/icons'

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
  },

  textField: {
    width: '400px',
  },

  title: {
    color: theme.palette.openTitle,
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

const Signup = () => {
  const [newUser, setNewUser] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const classes = useStyles()

  const onSubmit = (event) => {
    event.preventDefault()

    console.log(event)

    create(
      { name, email, password },
      setNewUser,
      setLoading,
      setError
    )
  }

  // if (newUser) return <Redirect to="/signin" />

  return (
    <>
      <Card
        className={classes.card}
        variant="outlined"
      >
        <CardContent>
          <Typography
            variant="h6"
            className={classes.title}
          >
            Sign Up
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
            value={password}
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
      <Dialog
        open={newUser ? true : false}
        disableBackdropClick={true}
      >
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button
              color="primary"
              autoFocus="autoFocus"
              variant="contained"
              fullWidth={true}
            >
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Signup
