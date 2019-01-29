import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  if (!auth.isAuthenticated) {
    navigate(`./app/login`)
    return null
  }

  return <Component {...rest} props={auth} />
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)
