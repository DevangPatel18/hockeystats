import React from 'react'
import { Link } from 'gatsby'
import jwt_decode from 'jwt-decode'
import styled from 'styled-components'
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
  if (localStorage.hasOwnProperty('players')) {
    store.dispatch(getPlayerList())
  }
}

const HeroContainer = styled.div`
  font-family: 'Open Sans', sans-serif;
  position: relative;
  top: 25vh;
`

const HeroHeader = styled.h1`
  font-size: 3rem;
  font-weight: 400;
`

const HeroText = styled.p`
  font-size: 1rem;
`

const IndexPage = () => (
  <Layout>
    <HeroContainer>
      <HeroHeader>Welcome to Skates & Stats!</HeroHeader>
      <HeroText>
        Select, track, and compare players in different categories
      </HeroText>
      <Link to="/app/home">Home</Link>
      <br />
      <Link to="/app/profile">Your profile</Link>
    </HeroContainer>
  </Layout>
)

export default IndexPage
