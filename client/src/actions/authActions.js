import API from '../utils/api'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { getPlayerList } from '../actions/statActions'
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  TOKEN_CHECK,
  USER_LOADING,
  SEND_EMAIL,
  PASSWORD_RESET,
} from './types'
import { navigate } from 'gatsby'

// Register User
export const registerUser = userData => dispatch => {
  API.post('/api/users/register', userData)
    .then(() => {
      navigate(`/app/login`) // re-direct to login on successful register
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
  API.post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', token)
      }
      // Set token to Auth header
      setAuthToken(token)
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user
      dispatch(setCurrentUser(decoded))
      dispatch(getPlayerList(decoded.id))
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
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwtToken')
  }
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
  dispatch(getPlayerList())
  dispatch(setUserLoading())
  navigate('/app/login')
}

// Send Password reset email
export const sendResetEmail = email => dispatch => {
  dispatch(setUserLoading())
  API.post('/api/sendResetEmail', email)
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
  API.get(`/api/resetUrlStatus/${tokenUrl}`)
    .then(res => dispatch({ type: TOKEN_CHECK, tokenStatus: true }))
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data })
    })
}

// Reset User password
export const passwordReset = resetData => dispatch => {
  dispatch(setUserLoading())
  const { userData, token } = resetData

  API.put(`/api/passwordReset/${token}`, userData)
    .then(res => {
      const { message } = res.data
      dispatch({ type: PASSWORD_RESET, message })
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data })
    })
}
