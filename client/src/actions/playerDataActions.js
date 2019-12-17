import { SUBMIT_QUERY } from './types'
import {
  getTeams,
  getCountries,
} from '../components/PlayerStats/PlayerStatsHelpers'
import store from '../store'

export const submitQuery = stats => dispatch => {
  const { playoffs, reportName } = store.getState().tableSettings
  dispatch({
    type: SUBMIT_QUERY,
    stats: stats.data,
    total: stats.total,
    teams: getTeams(stats.data),
    countries: getCountries(stats.data),
    dataType: playoffs ? 'playoffs' : 'regular',
    playerType: reportName.split('-')[0],
  })
}
