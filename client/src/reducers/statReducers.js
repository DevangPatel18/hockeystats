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
    case ADD_PLAYER:
      return {
        ...state,
        selectedPlayers: [...state.selectedPlayers, action.payload],
      }
    case REMOVE_PLAYER:
      const selectedPlayers = [...state.selectedPlayers]
      selectedPlayers.splice(selectedPlayers.indexOf(action.payload), 1)
      return {
        ...state,
        selectedPlayers,
      }
    default:
      return state
  }
}
