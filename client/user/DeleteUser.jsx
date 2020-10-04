import React, { useState } from 'react'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'

import { remove } from './apiUser'
import { clearJWT } from '../auth/authHelper'
import { useCurrentUser } from '../contexts/currentUser'

const DeleteUser = ({ userId }) => {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const { setCurrentUser } = useCurrentUser()

  const clickButton = () => {
    setOpen(true)
  }

  const handleRequestClose = () => {
    setOpen(false)
  }

  const deleteAccount = () => {
    remove(userId).then(() => {
      clearJWT(() => console.log('deleted'))
      setRedirect(true)
    })
  }

  if (redirect) {
    setCurrentUser(null)
    return <Redirect to="/" />
  }
  return (
    <span>
      <IconButton
        aria-label="Delete"
        onClick={clickButton}
        color="secondary"
      >
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRequestClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

export default DeleteUser
