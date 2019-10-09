import { CHANGE_YEARS } from './types'
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
