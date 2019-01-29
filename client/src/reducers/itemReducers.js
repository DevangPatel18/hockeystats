import { GET_ITEMS, REMOVE_ITEMS } from '../actions/types'

export default function(state = [], action) {
  switch (action.type) {
    case GET_ITEMS:
      return [...action.items]
    case REMOVE_ITEMS:
      return state.filter((x, i) => i !== action.itemIndex)
    default:
      return state
  }
}
