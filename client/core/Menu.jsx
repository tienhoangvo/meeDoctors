import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core'
import { Home } from '@material-ui/icons'

import {
  isAuthenticated,
  clearJWT,
} from '../auth/authHelper'

import { useCurrentUser } from './../contexts/currentUser'

const isActive = (history, path) => {
  return {
    color: `${
      history.location.pathname == path
        ? '#ff4081'
        : '#fff'
    }`,
  }
}

const Menu = withRouter(({ history }) => {
  const {
    currentUser,
    setCurrentUser,
  } = useCurrentUser()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          meeDoctors
        </Typography>
        <Link to="/">
          <IconButton
            aria-label="Home"
            style={isActive(history, '/')}
          >
            <Home />
          </IconButton>
        </Link>
        <Link
          to="/doctors"
          style={{ marginRight: 'auto' }}
        >
          <Button
            style={isActive(history, '/doctors')}
          >
            Doctors
          </Button>
        </Link>

        {!currentUser ? (
          <span id="getting-started-btns">
            <Link to="/signup">
              <Button
                style={isActive(history, '/signup')}
              >
                Signup
              </Button>
            </Link>
            <Link to="/signin">
              <Button
                style={isActive(history, '/signin')}
              >
                Signin
              </Button>
            </Link>
          </span>
        ) : (
          <span id="user-navigation-btns">
            <Link to={`/user/${currentUser._id}`}>
              <Button
                style={isActive(
                  history,
                  `/user/${currentUser._id}`
                )}
              >
                My profile
              </Button>
            </Link>

            <Button
              style={isActive(history, '/logout')}
              onClick={() => {
                clearJWT(() => {
                  setCurrentUser(null)
                  history.push('/')
                })
              }}
            >
              Logout
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  )
})

export default Menu
