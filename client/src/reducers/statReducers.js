import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  DATA_LOADING,
  DATA_LOADED,
  CLEAR_PLAYER_LIST,
} from '../actions/types'
const initialState = {
  trackedPlayers: [],
  dataLoad: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_LIST:
      return {
        ...state,
        trackedPlayers: action.payload,
      }
    case CLEAR_PLAYER_LIST:
      return {
        ...state,
        trackedPlayers: [],
      }
    case ADD_PLAYER:
      return {
        ...state,
        trackedPlayers: [...state.trackedPlayers, action.payload],
      }
    case REMOVE_PLAYER:
      const trackedPlayers = [...state.trackedPlayers]
      trackedPlayers.splice(trackedPlayers.indexOf(action.payload), 1)
      return {
        ...state,
        trackedPlayers,
      }
    case DATA_LOADING:
      return {
        ...state,
        dataLoad: true,
      }
    case DATA_LOADED:
      return {
        ...state,
        dataLoad: false,
      }
    default:
      return state
  }
}
