import {
  CHANGE_YEARS,
  CHANGE_FIELD,
  CHANGE_SORT,
  TOGGLE_SWITCH,
  LOAD_COLUMN_CONFIG,
} from './types'
import store from '../store'
import API from '../utils/api'

export const changeSeason = (name, year) => dispatch => {
  const { yearEnd } = store.getState().tableSettings
  if (name === 'yearStart' && year > yearEnd) {
    dispatch({
      type: CHANGE_YEARS,
      yearStart: year,
      yearEnd: year,
    })
  } else {
    dispatch({
      type: CHANGE_YEARS,
      [name]: year,
    })
  }
}

export const changeField = (name, value) => dispatch => {
  dispatch({
    type: CHANGE_FIELD,
    name,
    value,
  })
}

export const changeSort = (order, orderBy) => dispatch => {
  dispatch({
    type: CHANGE_SORT,
    order,
    orderBy,
  })
}

export const toggleSwitch = name => dispatch => {
  dispatch({
    type: TOGGLE_SWITCH,
    name,
  })
}

export const loadColumnConfig = () => async dispatch => {
  const colConfig = await API.get('/api/statistics/columnConfig')
    .then(res => res.data)
    .catch(err => console.log(err))
  dispatch({ type: LOAD_COLUMN_CONFIG, colConfig })
}
