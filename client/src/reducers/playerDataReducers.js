import { SUBMIT_QUERY } from '../actions/types'

const initialState = {
  stats: [],
  teams: '',
  countries: '',
  dataType: '',
  playerType: 'skater',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_QUERY:
      return {
        ...state,
        stats: action.stats,
        teams: ['all', ...action.teams],
        countries: ['all', ...action.countries],
        dataType: action.dataType,
        playerType: action.playerType,
      }
    default:
      return state
  }
}
