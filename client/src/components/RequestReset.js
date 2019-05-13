import React, { Component } from 'react'
import { Link, navigate } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sendResetEmail, clearErrors } from '../actions/authActions'

class RequestReset extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      errors: {},
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      navigate('/app/home')
    }
    this.props.clearErrors()
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      navigate('/app/home') // push user to dashboard when they login
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

  onSubmit = e => {
    e.preventDefault()

    const userData = {
      email: this.state.email,
    }

    this.props.sendResetEmail(userData)
  }

  render() {
    const { errors } = this.state
    return (
      <div>
        <h1>Request Password Reset</h1>
        <form noValidate onSubmit={this.onSubmit} style={styles.formContainer}>
          <label htmlFor="email">
            Email
            <span style={styles.error}>{errors.email}</span>
          </label>
          <input
            onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            id="email"
            type="email"
            style={styles.input}
          />
          <span style={styles.loading}>
            {this.props.auth.loading && 'Processing...'}
          </span>
          {Object.keys(errors).length !== 0 ? (
            <span style={styles.error}>{errors.message}</span>
          ) : (
            <span style={styles.success}>{this.props.auth.message}</span>
          )}
          <div style={styles.button} onClick={this.onSubmit}>
            <span style={styles.buttonText}>Send Email</span>
          </div>
        </form>
        <br />
        <Link to="/">Back to home</Link>
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
  },
  success: {
    color: 'green',
  },
}

RequestReset.propTypes = {
  sendResetEmail: PropTypes.func.isRequired,
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
  { sendResetEmail, clearErrors }
)(RequestReset)
