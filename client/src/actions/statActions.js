import API from '../utils/api'
import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_LOAD_STATUS,
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
  const { userId, playerId, seasonId } = userData

  if (userId) {
    API.put(`/api/playerList/${userId}/${playerId}/${seasonId}`)
      .then(() => {
        dispatch({ type: ADD_PLAYER, payload: { playerId, seasonId } })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    dispatch({ type: ADD_PLAYER, payload: { playerId, seasonId } })
  }
}

export const removePlayerList = userData => dispatch => {
  const { userId, playerId, seasonId } = userData

  if (userId) {
    API.delete(`/api/playerList/${userId}/${playerId}/${seasonId}`)
      .then(() => {
        dispatch({ type: REMOVE_PLAYER, payload: { playerId, seasonId } })
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    dispatch({ type: REMOVE_PLAYER, payload: { playerId, seasonId } })
  }
}

export const setLoadStatus = status => dispatch => {
  dispatch({ type: SET_LOAD_STATUS, payload: { status } })
}

export const openPlayerModal = (modal, playerObj) => dispatch => {
  dispatch({ type: OPEN_MODAL, payload: { playerObj }, modal })
}

export const closePlayerModal = modal => dispatch => {
  dispatch({ type: CLOSE_MODAL, modal })
}
