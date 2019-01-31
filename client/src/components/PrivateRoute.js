import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'

class PrivateRoute extends React.Component {
  state = {}

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      navigate(`/app/login`)
    }
    return null
  }

  render() {
    const { auth, component: Component, ...rest } = this.props

    return <Component {...rest} props={auth} />
  }
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRoute)
