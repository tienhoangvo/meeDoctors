import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import Home from './core/Home'
import Doctors from './user/Doctors'
import Signup from './auth/Signup'
import Signin from './auth/Signin'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import { CurrentUserProvider } from './contexts/currentUser'

const MainRouter = ({ user }) => {
  return (
    <CurrentUserProvider serverUser={user}>
      <>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute
            path="/user/edit/:userId"
            component={EditProfile}
          />

          <Route
            path="/user/:userId"
            component={Profile}
          />
        </Switch>
      </>
    </CurrentUserProvider>
  )
}

export default MainRouter
