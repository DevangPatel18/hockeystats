import * as types from '../actions/types'

const initialState = {
  yearStart: '20182019',
  yearEnd: '20182019',
  reportName: 'skatersummary',
  playoffs: false,
  isAggregate: false,
  filterTracked: false,
  search: '',
  playerPositionCode: 'LRCD',
  teamFilter: 'all',
  countryFilter: 'all',
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
    case types.TOGGLE_SWITCH:
      return {
        ...state,
        [action.name]: !state[action.name],
      }
    default:
      return state
  }
}
