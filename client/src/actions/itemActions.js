import axios from 'axios'
import { GET_ITEMS, REMOVE_ITEMS, GET_ERRORS } from './types'

export const getItems = userId => dispatch => {
  axios
    .get(`/api/items/${userId}`)
    .then(res => dispatch({ type: GET_ITEMS, items: res.data }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}

export const addItems = (userId, item) => dispatch => {
  axios
    .put(`/api/items/${userId}`, { item })
    .then(() => dispatch(getItems(userId)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}

export const removeItems = (userId, itemIndex) => dispatch => {
  axios
    .delete(`/api/items/${userId}/${itemIndex}`)
    .then(() => dispatch({ type: REMOVE_ITEMS, itemIndex }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
}
