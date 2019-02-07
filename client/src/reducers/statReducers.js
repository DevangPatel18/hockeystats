import { GET_PLAYER_LIST, ADD_PLAYER, REMOVE_PLAYER } from '../actions/types'
const initialState = {
  selectedPlayers: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_LIST:
      return {
        ...state,
        selectedPlayers: action.payload,
      }
    default:
      return state
  }
}
