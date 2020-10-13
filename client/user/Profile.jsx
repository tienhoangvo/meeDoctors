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
import Fetch from '../components/utils/Fetch'

const Profile = ({ match, history }) => {
  const { currentUser } = useCurrentUser()
  console.log(match)
  return (
    <Fetch
      url={`/api/v1/users/${match.params.userId}`}
      renderSuccess={({ data }) => {
        console.log('FROM MY PROFILE', data.data.user)
        return (
          <Paper evelation={4}>
            <Typography variant="h6">
              Profile
            </Typography>
            <List dense>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={data.data.user.fullName}
                  secondary={data.data.user.email}
                />
                {currentUser &&
                  currentUser._id ===
                    data.data.user._id && (
                    <ListItemSecondaryAction
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Link
                        to={`/user/edit/${data.data.user._id}`}
                      >
                        <Edit color="primary" />
                      </Link>
                      <DeleteUser
                        userId={data.data.user._id}
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
                      data.data.user.createdAt
                    ).toDateString()
                  }
                />
              </ListItem>
            </List>
          </Paper>
        )
      }}
      renderError={() => <Redirect to="/signin" />}
    />
  )
}
export default Profile
