import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logoutUser } from '../actions/authActions'

class Header extends React.Component {
  render() {
    const { siteTitle } = this.props
    return (
      <div
        style={{
          background: 'royalblue',
          marginBottom: '1.45rem',
        }}
      >
        <div
          style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '1.45rem 1.0875rem',
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link to="/" style={styles.headerTitle}>
              {siteTitle}
            </Link>
          </h1>

          {this.props.auth.isAuthenticated && (
            <p
              onClick={() => {
                this.props.logoutUser()
              }}
              style={styles.link}
            >
              Sign Out
            </p>
          )}
        </div>
      </div>
    )
  }
}

const styles = {
  headerTitle: {
    color: 'white',
    textDecoration: 'none',
  },
  link: {
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'underline',
    textAlign: 'right',
  },
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
