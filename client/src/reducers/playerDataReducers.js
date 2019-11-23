import { SUBMIT_QUERY } from '../actions/types'

const initialState = {
  stats: [],
  teams: '',
  countries: '',
  dataType: '',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_QUERY:
      return {
        ...state,
        stats: action.stats,
        teams: ['all', ...action.teams],
        countries: action.countries,
        dataType: action.dataType,
      }
    default:
      return state
  }
}
