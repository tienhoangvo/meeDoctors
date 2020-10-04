import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import { CurrentUserProvider } from './contexts/currentUser'

const MainRouter = ({ user }) => {
  return (
    <CurrentUserProvider serverUser={user}>
      <div
        style={{ padding: '40px 200px 200px 200px' }}
      >
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute
            path="/user/edit/:userId"
            component={EditProfile}
          />

          <Route
            exact
            path="/user/:userId"
            component={Profile}
          />
        </Switch>
      </div>
    </CurrentUserProvider>
  )
}

export default MainRouter
