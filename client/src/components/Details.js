import React from 'react'
import { Link } from 'gatsby'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core/'

const Home = props => {
  const { auth } = props
  const { email, name } = auth.user
  return (
    <div>
      <h1>Profile Details</h1>
      <p>Email: {email}</p>
      <p>Username: {name}</p>
      <Button
        component={Link}
        to="/app/home"
        color="primary"
        variant="contained"
        size="large"
        style={{ marginTop: '1rem' }}
      >
        Home
      </Button>
    </div>
  )
}

Home.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(Home)
