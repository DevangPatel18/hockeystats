import React from 'react'
import { Link, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './styles//LoginStyles'
import { loginUser, clearErrors } from '../actions/authActions'

class Login extends React.Component {
  state = {
    email: ``,
    password: ``,
    errors: {},
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to home
    if (this.props.auth.isAuthenticated) {
      navigate('/app/home')
    }
    this.props.clearErrors()
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      navigate('/app/home')
    }
    if (nextProps.errors) {
      return {
        errors: nextProps.errors,
      }
    }
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  login = e => {
    e.preventDefault()

    const userData = {
      email: this.state.email,
      password: this.state.password,
    }

    this.props.loginUser(userData)
  }

  render() {
    const { errors } = this.state
    return (
      <div>
        <h1>Sign In</h1>
        <form noValidate onSubmit={this.login} style={styles.formContainer}>
          <label htmlFor="email">
            Email
            <span style={styles.error}>{errors.email}</span>
          </label>
          <input
            onChange={this.handleUpdate}
            name="email"
            type="email"
            id="email"
            value={this.state.email}
            style={styles.input}
          />
          <label htmlFor="password">
            Password
            <span style={styles.error}>{errors.password}</span>
          </label>
          <input
            onChange={this.handleUpdate}
            name="password"
            id="password"
            value={this.state.password}
            type="password"
            autoComplete=""
            style={styles.input}
          />
          <div style={styles.button} onClick={this.login}>
            <span style={styles.buttonText}>Sign In</span>
          </div>
        </form>
        <Link to="/app/signup">Sign Up</Link>
        <br />
        <Link to="/app/requestreset">Forgot password?</Link>
        <br />
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(Login)
