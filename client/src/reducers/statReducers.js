import { GET_PLAYER_LIST, ADD_PLAYER, REMOVE_PLAYER } from '../actions/types'
const initialState = {
  trackedPlayers: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_LIST:
      return {
        ...state,
        trackedPlayers: action.payload,
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
    default:
      return state
  }
}
