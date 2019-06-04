import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Img from 'gatsby-image'
import jwt_decode from 'jwt-decode'
import styled from 'styled-components'
import { Button } from '@material-ui/core/'
import store from '../store'
import setAuthToken from '../utils/setAuthToken'
import { setCurrentUser, logoutUser } from '../actions/authActions'
import { getPlayerList } from '../actions/statActions'
import { navigate } from 'gatsby'
import Layout from '../components/layout'

const heroBreak = '770px'
const mobileWidth = '425px'
const Charts =
  'https://res.cloudinary.com/dbeqp2lyo/image/upload/v1554606574/Hockey%20stats/Charts.svg'

if (typeof window !== 'undefined') {
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
}

const HeroBackground = styled(Img)`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

const HeroContent = styled.div`
  position: relative;
  height: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0 2rem;
  font-family: 'Open Sans', sans-serif;

  @media (max-width: ${heroBreak}) {
    flex-direction: column;
    flex-wrap: wrap;
  }
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
  width: 400px;

  @media (max-width: ${mobileWidth}) {
    width: auto;
  }
`

const HeroContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100vh - 70px);
  left: 0;
  top: 70px;
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
              <div>
                <HeroHeader>Welcome to Skates & Stats!</HeroHeader>
                <HeroText>
                  Select, track, and compare players in different categories
                </HeroText>
                <Button
                  component={Link}
                  to="/app/playerstats"
                  color="primary"
                  variant="contained"
                  size="large"
                >
                  View statistics
                </Button>
              </div>
              <ChartImg src={Charts} size="400px" alt="Charts" />
            </HeroContent>
          </HeroContainer>
        </Layout>
      )
    }}
  />
)

export default IndexPage
