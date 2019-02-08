import axios from 'axios'
import { GET_PLAYER_LIST, ADD_PLAYER, REMOVE_PLAYER } from './types'

export const getPlayerList = userId => dispatch => {
  axios
    .get(`/api/playerList/${userId}`)
    .then(res => {
      const { playerList } = res.data
      dispatch({ type: GET_PLAYER_LIST, payload: playerList })
    })
    .catch(err => {
      console.log(err)
    })
}

export const addPlayerList = userData => dispatch => {
  const { userId, playerId } = userData
  axios
    .put(`/api/playerList/${userId}/${playerId}`)
    .then(() => {
      dispatch({ type: ADD_PLAYER, payload: playerId })
    })
    .catch(err => {
      console.log(err)
    })
}

export const removePlayerList = userData => dispatch => {
  const { userId, playerId } = userData
  axios
    .delete(`/api/playerList/${userId}/${playerId}`)
    .then(() => {
      dispatch({ type: REMOVE_PLAYER, payload: playerId })
    })
    .catch(err => {
      console.log(err)
    })
}
