import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import jwt_decode from 'jwt-decode'
import styled from 'styled-components'
import store from '../store'
import setAuthToken from '../utils/setAuthToken'
import { setCurrentUser, logoutUser } from '../actions/authActions'
import { getPlayerList } from '../actions/statActions'
import { navigate } from 'gatsby'
import Layout from '../components/layout'

const Charts =
  'https://res.cloudinary.com/dbeqp2lyo/image/upload/v1554606574/Hockey%20stats/Charts.svg'

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

const HeroBackground = styled(Img)`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

const HeroContent = styled.div`
  font-family: 'Open Sans', sans-serif;
  position: relative;
`

const HeroHeader = styled.h1`
  font-size: 3rem;
  font-weight: 400;
`

const HeroText = styled.p`
  font-size: 1rem;
`

const ChartImg = styled.img`
  padding: 1rem;
  max-width: 400px;
`

const HeroContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  top: 25vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
`

const IndexPage = () => (
  <StaticQuery
    query={graphql`
      {
        file(relativePath: { eq: "ice-2025937_1920.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 1920) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => {
      const imgURL = data.file.childImageSharp.fluid

      return (
        <Layout>
          <HeroBackground fluid={imgURL} style={{ position: 'absolute' }} />
          <HeroContainer>
            <HeroContent>
              <HeroHeader>Welcome to Skates & Stats!</HeroHeader>
              <HeroText>
                Select, track, and compare players in different categories
              </HeroText>
              <Link to="/app/home">Home</Link>
              <br />
              <Link to="/app/profile">Your profile</Link>
            </HeroContent>
            <ChartImg src={Charts} alt="Charts" />
          </HeroContainer>
        </Layout>
      )
    }}
  />
)

export default IndexPage
