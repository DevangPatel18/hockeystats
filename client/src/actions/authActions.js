import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  SEND_EMAIL,
  PASSWORD_RESET,
} from './types'
import { navigate } from '@reach/router'

// Register User
export const registerUser = userData => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(() => {
      navigate(`/login`) // re-direct to login on successful register
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data
      localStorage.setItem('jwtToken', token)
      // Set token to Auth header
      setAuthToken(token)
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  }
}

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  }
}

// Clear errors
export const clearErrors = () => {
  return {
    type: GET_ERRORS,
    payload: {},
  }
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}

// Send Password reset email
export const sendResetEmail = email => dispatch => {
  dispatch(setUserLoading())
  axios
    .post('/api/sendResetEmail', email)
    .then(res => {
      const { message } = res.data
      dispatch({ type: SEND_EMAIL, message })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}

// Check for valid password reset page url
export const tokenCheck = tokenUrl => dispatch => {
  axios.get(`/api/resetUrlStatus/${tokenUrl}`).catch(err => {
    dispatch({ type: GET_ERRORS, payload: err.response.data })
  })
}

// Reset User password
export const passwordReset = resetData => dispatch => {
  dispatch(setUserLoading())
  const { userData, token } = resetData

  axios
    .put(`/api/passwordReset/${token}`, userData)
    .then(res => {
      const { message } = res.data
      dispatch({ type: PASSWORD_RESET, message })
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data })
    })
}
