import {
  SET_CURRENT_USER,
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
        loading: false,
      }
    default:
      return state
  }
}
