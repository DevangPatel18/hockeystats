import { SUBMIT_QUERY } from '../actions/types'

const initialState = {
  stats: [],
  teams: '',
  countries: '',
  dataType: '',
  sortObj: {},
  playerType: '',
  reportType: '',
  total: 0,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_QUERY:
      return {
        ...state,
        stats: action.stats,
        total: action.total,
        sortObj: action.sortObj,
        countries: ['all', ...action.countries],
        dataType: action.dataType,
        playerType: action.playerType,
        reportType: action.reportType,
      }
    default:
      return state
  }
}
