import * as types from '../actions/types'
import { getCurrentSeasonId } from '../helper/dateHelpers'

const currentSeason = getCurrentSeasonId()

const initialState = {
  yearStart: currentSeason,
  yearEnd: currentSeason,
  reportName: 'skater-summary',
  playoffs: false,
  isAggregate: false,
  filterTracked: false,
  search: '',
  playerPositionCode: 'LRCD',
  teamFilter: 'all',
  countryFilter: 'all',
  page: 0,
  rowsPerPage: 10,
  order: 'desc',
  orderBy: 'default',
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_YEARS:
      return {
        ...state,
        yearStart: action.yearStart || state.yearStart,
        yearEnd: action.yearEnd || state.yearEnd,
      }
    case types.CHANGE_FIELD:
      return {
        ...state,
        [action.name]: action.value,
      }
    case types.CHANGE_SORT:
      return {
        ...state,
        order: action.order,
        orderBy: action.orderBy,
      }
    case types.TOGGLE_SWITCH:
      return {
        ...state,
        [action.name]: !state[action.name],
      }
    case types.SUBMIT_QUERY:
      return {
        ...state,
        playerPositionCode: 'LRCD',
      }
    default:
      return state
  }
}
