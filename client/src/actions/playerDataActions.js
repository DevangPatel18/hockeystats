import { SUBMIT_QUERY } from './types'
import { getCountries } from '../components/PlayerStats/PlayerStatsHelpers'
import store from '../store'

export const submitQuery = stats => dispatch => {
  const { playoffs, reportName, sort } = store.getState().tableSettings
  dispatch({
    type: SUBMIT_QUERY,
    stats: stats.data,
    total: stats.total,
    sortObj: sort.reduce(
      (acc, { property, direction }) => ({ ...acc, [property]: direction }),
      {}
    ),
    countries: getCountries(stats.data),
    dataType: playoffs ? 'playoffs' : 'regular',
    playerType: reportName.split('-')[0],
    reportType: reportName.split('-')[1],
  })
}
