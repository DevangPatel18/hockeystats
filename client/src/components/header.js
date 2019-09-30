import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import MenuIcon from '@material-ui/icons/Menu'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import IconButton from '@material-ui/core/IconButton'
import {
  HeaderMain,
  HeaderContainer,
  HeaderTitle,
  HeaderNavList,
  NavStyled,
  UserLabelItem,
  UserNavList,
  UserNavItems,
  HeaderNavItems,
  LinkStyled,
  HamburgerBox,
} from './styles/HeaderStyles'
import { logoutUser } from '../actions/authActions'

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
            <HeaderNavList
              onClick={() => {
                this.setState({ menuOpen: false })
              }}
            >
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
