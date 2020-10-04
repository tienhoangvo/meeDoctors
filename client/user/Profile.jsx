import React, { useState, useEffect } from 'react'

import { CancelToken } from 'axios'
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  LinearProgress,
  ListItemSecondaryAction,
} from '@material-ui/core'

import {
  Person,
  Error,
  Edit,
} from '@material-ui/icons'
import { isAuthenticated } from './../auth/authHelper'
import { read } from './apiUser'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import DeleteUser from './DeleteUser'
import { useCurrentUser } from '../contexts/currentUser'

const Profile = ({ match, history }) => {
  const [
    redirectToSignin,
    setRedirectToSignin,
  ] = useState(false)
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const { currentUser } = useCurrentUser()
  useEffect(() => {
    const source = CancelToken.source()
    read(
      source.token,
      match.params.userId,
      setUser,
      setLoading,
      setError
    )

    return function cleanup() {
      source.cancel('Cancel profile request')
    }
  }, [history.location.pathname])

  if (redirectToSignin)
    return <Redirect to="/signin" />

  if (error) {
    setRedirectToSignin(true)
  }

  return (
    <>
      {loading && <LinearProgress />}
      {user && (
        <Paper evelation={4}>
          <Typography variant="h6">Profile</Typography>
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={user.email}
              />
              {currentUser &&
                currentUser._id === user._id && (
                  <ListItemSecondaryAction
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Link
                      to={`/user/edit/${user._id}`}
                    >
                      <Edit color="primary" />
                    </Link>
                    <DeleteUser
                      userId={user._id}
                      history={history}
                    />
                  </ListItemSecondaryAction>
                )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary={
                  'Joined: ' +
                  new Date(
                    user.createdAt
                  ).toDateString()
                }
              />
            </ListItem>
          </List>
        </Paper>
      )}
    </>
  )
}
export default Profile
