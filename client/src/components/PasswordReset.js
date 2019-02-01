import React, { Component } from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { tokenCheck, passwordReset } from '../actions/authActions'

class PasswordReset extends Component {
  constructor() {
    super()
    this.state = {
      password: '',
      password2: '',
      errors: {},
    }
  }

  async componentDidMount() {
    // Run action creator that checks for valid reset token
    this.props.tokenCheck(this.props.resetToken)
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      navigate('/dashboard') // push user to dashboard when they access password reset page
    }
    if (nextProps.errors) {
      return {
        errors: nextProps.errors,
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  updatePassword = e => {
    e.preventDefault()
    // Run action creator that validates password
    const userData = {
      password: this.state.password,
      password2: this.state.password2,
    }
    const token = this.props.resetToken
    this.props.passwordReset({ userData, token })
  }

  render() {
    const { errors } = this.state

    if (errors.message)
      return <span className="red-text">{errors.message}</span>

    return (
      <div>
        <h1>Reset Password</h1>
        <form
          noValidate
          onSubmit={this.updatePassword}
          style={styles.formContainer}
        >
          <label htmlFor="password">
            Password
            <span style={styles.error}>{errors.password}</span>
          </label>
          <input
            onChange={this.onChange}
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
            onChange={this.onChange}
            name="password2"
            id="password2"
            value={this.state.password2}
            type="password"
            autoComplete=""
            style={styles.input}
          />
          {this.props.auth.loading ? (
            <span style={styles.loading}>Loading...</span>
          ) : (
            <span style={styles.success}>{this.props.auth.message}</span>
          )}
          <div style={styles.button} onClick={this.updatePassword}>
            <span style={styles.buttonText}>Reset Password</span>
          </div>
        </form>
      </div>
    )
  }
}

const styles = {
  input: {
    height: 40,
    margin: '10px 0px',
    padding: 7,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'royalblue',
    padding: '15px 7px',
    cursor: 'pointer',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
  loading: {
    color: 'blue',
  },
  error: {
    color: 'red',
    fontSize: '0.7em',
    float: 'right',
  },
  success: {
    color: 'green',
  },
}

PasswordReset.propTypes = {
  tokenCheck: PropTypes.func.isRequired,
  passwordReset: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(
  mapStateToProps,
  { tokenCheck, passwordReset }
)(PasswordReset)
