import React from 'react'
import { Link } from 'gatsby'
import jwt_decode from 'jwt-decode'
import store from '../store'
import setAuthToken from '../utils/setAuthToken'
import { setCurrentUser, logoutUser } from '../actions/authActions'
import { getPlayerList } from '../actions/statActions'
import { navigate } from 'gatsby'
import Layout from '../components/layout'

const token = localStorage.jwtToken
// Check for token to keep user logged in
if (token) {
  // Set auth token header auth
  setAuthToken(token)
  // Decode token and get user info and exp
  const decoded = jwt_decode(token)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))
  // Set trackedPlayers list from user id
  store.dispatch(getPlayerList(decoded.id))
  // Check for expired token
  const currentTime = Date.now() / 1000 // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // Redirect to login
    navigate(`app/login`)
  }
} else {
  // Set trackedPlayers list from local storage
  store.dispatch(getPlayerList())
}

const IndexPage = () => (
  <Layout>
    <h1>Hi people</h1>
    <p>
      Create a new account: <Link to="/app/signup">Sign Up</Link>
    </p>
    <Link to="/app/login">Sign In</Link>
    <br />
    <Link to="/app/home">Home</Link>
    <br />
    <Link to="/app/profile">Your profile</Link>
    <br />
    <Link to="/app/playerstats">Player Statistics</Link>
    <br />
    <Link to="/app/dashboard">Dashboard</Link>
  </Layout>
)

export default IndexPage
