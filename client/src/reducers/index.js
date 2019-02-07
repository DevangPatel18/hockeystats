import { combineReducers } from 'redux'
import authReducer from './authReducers'
import errorReducer from './errorReducers'
import statReducer from './statReducers'
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  stats: statReducer,
})
