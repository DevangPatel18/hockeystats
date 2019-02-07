import axios from 'axios'
import { GET_PLAYER_LIST } from './types'

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
