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
  makeStyles,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {
  ArrowForward,
  Person,
} from '@material-ui/icons'
import Fetch from '../components/utils/Fetch'

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

const Doctors = () => {
  console.log('Users')
  const classes = useStyles()
  console.log('CLASSES', classes)
  return (
    <Fetch
      url="/api/v1/users?role=doctor"
      renderSuccess={({ data }) => (
        <Paper className={classes.root} elevation={4}>
          <Typography
            variant="h6"
            className={classes.title}
          >
            All Doctors
          </Typography>
          <List dense>
            {data.data.users.map((user) => (
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
                  <ListItemText
                    primary={user.fullName}
                  />
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
      )}
    />
  )
}

export default Doctors
