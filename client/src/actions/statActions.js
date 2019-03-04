import axios from 'axios'
import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  DATA_LOADING,
  DATA_LOADED,
} from './types'

export const getPlayerList = userId => dispatch => {
  if (userId) {
    axios
      .get(`/api/playerList/${userId}`)
      .then(res => {
        const { playerList } = res.data
        dispatch({ type: GET_PLAYER_LIST, payload: playerList })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    dispatch({
      type: GET_PLAYER_LIST,
      payload: JSON.parse(localStorage.getItem('players')),
    })
  }
}

export const addPlayerList = userData => dispatch => {
  const { userId, playerId } = userData

  if (userId) {
    axios
      .put(`/api/playerList/${userId}/${playerId}`)
      .then(() => {
        dispatch({ type: ADD_PLAYER, payload: playerId })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    dispatch({ type: ADD_PLAYER, payload: playerId })
  }
}

export const removePlayerList = userData => dispatch => {
  const { userId, playerId } = userData

  if (userId) {
    axios
      .delete(`/api/playerList/${userId}/${playerId}`)
      .then(() => {
        dispatch({ type: REMOVE_PLAYER, payload: playerId })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    dispatch({ type: REMOVE_PLAYER, payload: playerId })
  }
}

export const startLoad = event => dispatch => {
  console.log('start loading from dfunction')
  dispatch({ type: DATA_LOADING })
}

export const stopLoad = event => dispatch => {
  console.log('stop loading from dfunction')
  dispatch({ type: DATA_LOADED })
}
