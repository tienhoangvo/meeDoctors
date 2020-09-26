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

const isActive = (history, path) => {
  return {
    color: `${
      history.location.pathname == path
        ? '#ff4081'
        : '#fff'
    }`,
  }
}

const Menu = withRouter(({ history, user }) => {
  console.log('is authenticated', isAuthenticated())
  console.log('test', user)
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          MERN Skeletoon
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
          to="/users"
          style={{ marginRight: 'auto' }}
        >
          <Button style={isActive(history, '/users')}>
            Users
          </Button>
        </Link>

        {!isAuthenticated() ? (
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
            <Link
              to={`/user/${
                isAuthenticated().user._id
              }`}
            >
              <Button
                style={isActive(
                  history,
                  `/user/${isAuthenticated().user._id}`
                )}
              >
                My profile
              </Button>
            </Link>

            <Button
              style={isActive(history, '/logout')}
              onClick={() => {
                clearJWT(() => history.push('/'))
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
