import { SUBMIT_QUERY } from './types'
import {
  getTeams,
  getCountries,
} from '../components/PlayerStats/PlayerStatsHelpers'
import store from '../store'

export const submitQuery = stats => dispatch => {
  const { playoffs } = store.getState().tableSettings
  dispatch({
    type: SUBMIT_QUERY,
    stats,
    teams: getTeams(stats),
    countries: getCountries(stats),
    dataType: playoffs ? 'playoffs' : 'regular',
  })
}
