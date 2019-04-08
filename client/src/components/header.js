import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { logoutUser } from '../actions/authActions'

const HeaderMain = styled.div`
  background: #333333;
`

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  min-height: 70px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: white;
`

const HeaderTitle = styled.h1`
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

const UserLabelItem = styled.li`
  display: flex;
  align-items: flex-end;
  position: relative;
  margin: 0;
  padding: 0.3rem 1rem;
  list-style: none;
  cursor: pointer;

  &:hover ul {
    height: 99px;
  }
`

const UserNavList = styled.ul`
  display: flex;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.2s ease;
  width: 120px;
  height: 0;
  flex-direction: column;
  align-items: center;
  margin: 0;
  background: #444444;
  overflow: hidden;
`

const UserNavItems = styled.li`
  list-style: none;
  margin: 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.2rem 1rem;

  a {
    padding: 0.2rem 2rem;
    width: 100%;
  }

  &:hover {
    background: #4787fe;
  }
`

const HeaderNavItems = styled.li`
  a {
    margin: 0;
    padding: 0.2rem 0.4rem;
  }
  margin: 0 1rem;
  list-style: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4787fe;
  }
`

const LinkStyled = styled(Link)`
  color: white;
  text-decoration: none;
`

class Header extends React.Component {
  render() {
    const { siteTitle, auth } = this.props

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
                <UserLabelItem>
                  {auth.user.name} <ArrowDropDown />
                  <UserNavList>
                    <UserNavItems>
                      <LinkStyled to="/app/home">Home</LinkStyled>
                    </UserNavItems>
                    <UserNavItems>
                      <LinkStyled to="/app/profile">Profile</LinkStyled>
                    </UserNavItems>
                    <UserNavItems
                      onClick={() => {
                        this.props.logoutUser()
                      }}
                    >
                      Sign Out
                    </UserNavItems>
                  </UserNavList>
                </UserLabelItem>
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
