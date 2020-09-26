import React, { useEffect, useState } from 'react'
import {
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  ListItem,
  Typography,
  ListItemAvatar,
  Avatar,
  IconButton,
  List,
  LinearProgress,
  makeStyles,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  ArrowForward,
  Person,
} from '@material-ui/icons'
import { CancelToken } from 'axios'

import { list } from './apiUser'

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(5),
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
}))

const Users = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    const source = CancelToken.source()
    list(source.token, setUsers, setLoading, setError)

    return function cleanup() {
      console.log('canceled feeding users!')
      source.cancel('Operation cancled by the user')
      console.log(source)
    }
  }, [])

  if (loading) return <LinearProgress />

  if (error)
    return (
      <h1 style={{ fontSize: '50px' }}>
        {error.data.message}
      </h1>
    )

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography
        variant="h6"
        className={classes.title}
      >
        All Users
      </Typography>
      <List dense>
        {users.map((user) => (
          <Link
            to={`/user/${user._id}`}
            key={user._id}
          >
            <ListItem button>
              <ListItemAvatar>
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
              <ListItemSecondaryAction>
                <IconButton>
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
    </Paper>
  )
}

export default Users
