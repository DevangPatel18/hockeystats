import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  CLEAR_PLAYER_LIST,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_LOAD_STATUS,
} from '../actions/types'
const initialState = {
  trackedPlayers: [],
  dataLoad: false,
  gameLogModal: false,
  overviewModal: false,
  playerObj: {},
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_LIST:
      const playerList = action.payload.map(obj => {
        const playerId = parseInt(obj.playerId)
        const seasonId = parseInt(obj.seasonId)
        return { playerId, seasonId }
      })
      return {
        ...state,
        trackedPlayers: playerList,
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
      const index = trackedPlayers.findIndex(
        obj =>
          obj.playerId === action.payload.playerId &&
          obj.seasonId === action.payload.seasonId
      )
      trackedPlayers.splice(index, 1)
      return {
        ...state,
        trackedPlayers,
      }
    case SET_LOAD_STATUS:
      return {
        ...state,
        dataLoad: action.payload.status,
      }
    case OPEN_MODAL:
      return {
        ...state,
        [action.modal]: true,
        playerObj: action.payload.playerObj,
      }
    case CLOSE_MODAL:
      return {
        ...state,
        [action.modal]: false,
        playerObj: {},
      }
    default:
      return state
  }
}
