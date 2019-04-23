import API from '../utils/api'
import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  DATA_LOADING,
  DATA_LOADED,
} from './types'

export const getPlayerList = userId => dispatch => {
  if (userId) {
    API.get(`/api/playerList/${userId}`)
      .then(res => {
        const { playerList } = res.data
        dispatch({ type: GET_PLAYER_LIST, payload: playerList })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    if (typeof window !== 'undefined') {
      dispatch({
        type: GET_PLAYER_LIST,
        payload: JSON.parse(localStorage.getItem('players')),
      })
    }
  }
}

export const addPlayerList = userData => dispatch => {
  const { userId, playerId } = userData

  if (userId) {
    API.put(`/api/playerList/${userId}/${playerId}`)
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
    API.delete(`/api/playerList/${userId}/${playerId}`)
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
