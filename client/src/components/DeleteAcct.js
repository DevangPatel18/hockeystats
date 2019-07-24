import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { deleteUser } from '../actions/authActions'

class DeleteAcct extends Component {
  constructor() {
    super()
    this.state = {
      password: '',
      password2: '',
      errors: {},
      serverResponse: false,
      prompt: false,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.errors) {
      return { errors: nextProps.errors }
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value })
  }

  checkPassword = e => {
    e.preventDefault()

    this.handleClose()

    // Run action creator that validates password
    const userData = {
      password: this.state.password,
      password2: this.state.password2,
      userId: this.props.auth.user.id,
    }

    // Dispatch action to verify account deletion
    this.props.deleteUser(userData)
  }

  handleClickOpen = () => this.setState({ prompt: true })

  handleClose = () => this.setState({ prompt: false })

  render() {
    const { errors, prompt } = this.state

    return (
      <div>
        <h1>Delete Account</h1>
        <p>Please enter your password twice to verify account deletion.</p>
        <form
          noValidate
          onSubmit={this.checkPassword}
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
            <span style={styles.loading}>Verifying...</span>
          ) : (
            <span style={styles.success}>{this.props.auth.message}</span>
          )}
          <div style={styles.button} onClick={this.handleClickOpen}>
            <span style={styles.buttonText}>Delete Account</span>
          </div>
        </form>

        <Dialog
          open={prompt}
          onClose={this.handleClose}
          aria-labelledby="deleteaccount-title"
          aria-describedby="deleteaccount-description"
        >
          <DialogTitle id="deleteaccount-title">WARNING</DialogTitle>
          <DialogContent>
            <DialogContentText id="deleteaccount-description">
              All user data will be deleted, including userId, email address,
              and player list. Click 'Confirm' to continue account deletion.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.checkPassword} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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

DeleteAcct.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
})

export default connect(
  mapStateToProps,
  { deleteUser }
)(DeleteAcct)
