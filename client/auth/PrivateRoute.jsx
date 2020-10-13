import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useCurrentUser } from './../contexts/currentUser'
const PrivateRoute = ({
  component: Component,
  ...rest
}) => {
  const { currentUser } = useCurrentUser()
  console.log('current', currentUser)
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
