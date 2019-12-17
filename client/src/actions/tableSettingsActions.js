import { CHANGE_YEARS, CHANGE_FIELD, CHANGE_SORT, TOGGLE_SWITCH } from './types'
import store from '../store'

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
