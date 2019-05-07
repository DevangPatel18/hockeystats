import {
  SET_CURRENT_USER,
  TOKEN_CHECK,
  USER_LOADING,
  PASSWORD_RESET,
  SEND_EMAIL,
  GET_ERRORS,
} from '../actions/types'
const isEmpty = require('is-empty')
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  tokenStatus: '',
}
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      }
    case TOKEN_CHECK:
      return {
        ...state,
        tokenStatus: action.tokenStatus,
      }
    case PASSWORD_RESET:
      return {
        ...state,
        message: action.message,
        loading: false,
      }
    case SEND_EMAIL:
      return {
        ...state,
        message: action.message,
        loading: false,
      }
    case GET_ERRORS:
      return {
        ...state,
        message: '',
        loading: false,
      }
    default:
      return state
  }
}
