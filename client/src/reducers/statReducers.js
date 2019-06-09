import {
  GET_PLAYER_LIST,
  ADD_PLAYER,
  REMOVE_PLAYER,
  DATA_LOADING,
  DATA_LOADED,
  CLEAR_PLAYER_LIST,
  OPEN_MODAL,
  CLOSE_MODAL,
} from '../actions/types'
const initialState = {
  trackedPlayers: [],
  dataLoad: false,
  modalOpen: false,
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
    case OPEN_MODAL:
      return {
        ...state,
        modalOpen: true,
        playerObj: action.payload.playerObj,
      }
    case CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false,
        playerObj: {},
      }
    default:
      return state
  }
}
