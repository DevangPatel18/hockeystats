import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { logoutUser } from '../actions/authActions'

const HeaderMain = styled.div`
  background: #333333;
`

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  min-height: 120px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: white;
`

const HeaderTitle = styled.h1`
  font-family: 'Lato', sans-serif;
  margin: 0;
  a {
    color: white;
    text-decoration: none;
  }
`

const HeaderNavList = styled.ul`
  font-family: 'Lato', sans-serif;
  display: flex;
  align-items: center;
  margin: 0;
`

const HeaderNavItems = styled.li`
  margin: 0 1rem;
  list-style: none;
  cursor: pointer;
`

const LinkStyled = styled(Link)`
  color: white;
  text-decoration: none;
`

class Header extends React.Component {
  render() {
    const { siteTitle } = this.props
    return (
      <HeaderMain>
        <HeaderContainer>
          <HeaderTitle>
            <Link to="/">{siteTitle}</Link>
          </HeaderTitle>
          <div style={{ flexGrow: '1' }} />

          <nav>
            <HeaderNavList>
              {this.props.auth.isAuthenticated ? (
                <HeaderNavItems
                  onClick={() => {
                    this.props.logoutUser()
                  }}
                >
                  Sign Out
                </HeaderNavItems>
              ) : (
                <>
                  <HeaderNavItems>
                    <LinkStyled to="/app/signup">Sign Up</LinkStyled>
                  </HeaderNavItems>
                  <HeaderNavItems>
                    <LinkStyled to="/app/login">Sign In</LinkStyled>
                  </HeaderNavItems>
                </>
              )}

              <HeaderNavItems>
                <LinkStyled to="/app/playerstats">Player Statistics</LinkStyled>
              </HeaderNavItems>
              <HeaderNavItems>
                <LinkStyled to="/app/dashboard">Dashboard</LinkStyled>
              </HeaderNavItems>
            </HeaderNavList>
          </nav>
        </HeaderContainer>
      </HeaderMain>
    )
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { logoutUser }
)(Header)
