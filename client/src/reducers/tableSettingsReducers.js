import * as types from '../actions/types'

const initialState = {
  yearStart: '20182019',
  yearEnd: '20182019',
  reportName: 'skatersummary',
  playoffs: false,
  isAggregate: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_YEARS:      
      return {
        ...state,
        yearStart: action.yearStart || state.yearStart,
        yearEnd: action.yearEnd || state.yearEnd,
      }
    default:
      return state
  }
}
