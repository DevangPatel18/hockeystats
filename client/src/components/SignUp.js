import React from 'react'
import { Link, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './styles/SignUpStyles'
import { registerUser, clearErrors } from '../actions/authActions'

const initialState = {
  name: ``,
  email: '',
  password: ``,
  password2: ``,
  errors: {},
}

class SignUp extends React.Component {
  state = initialState

  componentDidMount() {
    // If logged in and user navigates to SignUp page, should redirect them to Home
    if (this.props.auth.isAuthenticated) {
      navigate('/app/home')
    }
    this.props.clearErrors()
  }

  handleUpdate = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.errors) {
      return {
        errors: nextProps.errors,
      }
    }
  }

  signUp = e => {
    e.preventDefault()

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    }

    this.props.registerUser(newUser)
  }

  render() {
    const { errors } = this.state

    return (
      <div>
        <h1>Sign Up</h1>
        <form noValidate onSubmit={this.signUp} style={styles.formContainer}>
          <label htmlFor="name">
            Name
            <span style={styles.error}>{errors.name}</span>
          </label>
          <input
            onChange={this.handleUpdate}
            name="name"
            id="name"
            value={this.state.name}
            style={styles.input}
          />

          <label htmlFor="email">
            Email
            <span style={styles.error}>{errors.email}</span>
          </label>
          <input
            onChange={this.handleUpdate}
            name="email"
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
          <label htmlFor="password2">
            Confirm Password
            <span style={styles.error}>{errors.password2}</span>
          </label>
          <input
            onChange={this.handleUpdate}
            name="password2"
            id="password2"
            value={this.state.password2}
            type="password"
            autoComplete=""
            style={styles.input}
          />
          <div style={styles.button} onClick={this.signUp}>
            <span style={styles.buttonText}>Sign Up</span>
          </div>
        </form>

        <Link to="/app/login">Sign In</Link>
      </div>
    )
  }
}

SignUp.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
  { registerUser, clearErrors }
)(SignUp)
