import { SUBMIT_QUERY } from './types'
import {
  getCountries,
  getSortParams,
} from '../components/PlayerStats/PlayerStatsHelpers'
import store from '../store'

export const submitQuery = stats => dispatch => {
  const { playoffs, reportName } = store.getState().tableSettings
  dispatch({
    type: SUBMIT_QUERY,
    stats: stats.data,
    total: stats.total,
    sort: getSortParams().reduce(
      (acc, { property, direction }) => ({ ...acc, [property]: direction }),
      {}
    ),
    countries: getCountries(stats.data),
    dataType: playoffs ? 'playoffs' : 'regular',
    playerType: reportName.split('-')[0],
    reportType: reportName.split('-')[1],
  })
}
