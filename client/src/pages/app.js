import React from 'react'
import { Router } from '@reach/router'
import Layout from '../components/layout'
import Details from '../components/Details'
import Home from '../components/Home'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import PrivateRoute from '../components/PrivateRoute'
import RequestReset from '../components/RequestReset'
import PasswordReset from '../components/PasswordReset'

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/home" component={Home} />
      <PrivateRoute path="/app/profile" component={Details} />
      <Login path="/app/login" />
      <SignUp path="/app/signup" />
      <RequestReset path="/app/requestreset" />
      <PasswordReset path="/app/passwordreset/:resetToken" />
    </Router>
  </Layout>
)

export default App
