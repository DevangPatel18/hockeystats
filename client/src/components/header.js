import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import { logoutUser } from '../actions/authActions'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import IconButton from '@material-ui/core/IconButton'

const mobileWidth = '900px'

const HeaderMain = styled.div`
  background: #333333;
  z-index: 5;
`

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  min-height: 70px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: white;
  position: relative;
`

const HeaderTitle = styled.h1`
  margin: 0 1rem;
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

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
  }
`

const NavStyled = styled.nav`
  z-index: 4;
  @media (max-width: ${mobileWidth}) {
    position: absolute;
    top: 100%;
    width: 100%;
    background: rgba(68, 68, 68, 0.7);
    overflow: hidden;
    height: ${props => (props.menuOpen ? 'auto' : 0)};
  }
`

const UserLabelItem = styled.li`
  display: flex;
  position: relative;
  margin: 0;
  padding: 0.3rem 1rem;
  list-style: none;
  cursor: pointer;

  div {
    display: flex;
    align-items: flex-end;
  }

  &:hover ul {
    height: 99px;
  }

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    align-items: center;
    padding: 0;

    &:hover ul {
      height: auto;
    }
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

  @media (max-width: ${mobileWidth}) {
    background: none;
    position: static;
    height: auto;
    transform: translateX(0%);
  }
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

  @media (max-width: ${mobileWidth}) {
    padding: 0;
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

const HamburgerBox = styled.div`
  display: none;
  @media (max-width: ${mobileWidth}) {
    display: block;
  }
`

class Header extends React.Component {
  constructor() {
    super()
    this.state = {
      menuOpen: false,
    }
  }

  handleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  render() {
    const { siteTitle, auth } = this.props
    const { menuOpen } = this.state

    return (
      <HeaderMain>
        <HeaderContainer>
          <HeaderTitle>
            <Link to="/">{siteTitle}</Link>
          </HeaderTitle>
          <div style={{ flexGrow: '1' }} />
          <NavStyled menuOpen={menuOpen}>
            <HeaderNavList>
              {this.props.auth.isAuthenticated ? (
                <UserLabelItem>
                  <div>
                    {auth.user.name} <ArrowDropDown />
                  </div>
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
          </NavStyled>
          <HamburgerBox>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={this.handleMenu}
            >
              {menuOpen ? <ArrowUpward /> : <MenuIcon />}
            </IconButton>
          </HamburgerBox>
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
