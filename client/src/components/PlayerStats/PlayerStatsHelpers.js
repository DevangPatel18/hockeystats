import store from '../../store'

const sortStatsASC = [
  'goalsAgainstAverage',
  'lastName',
  'skaterFullName',
  'goalieFullName',
]

export const fetchData = api => {
  const {
    filterTracked,
    colConfig,
    sort,
    ...params
  } = store.getState().tableSettings

  return api
    .request({
      method: 'get',
      url: '/api/statistics/playerstats',
      params: { ...params, sort: JSON.stringify(sort) },
    })
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })
}

export const getTeams = stats => {
  const { isAggregate } = store.getState().tableSettings

  return !isAggregate
    ? stats
        .reduce((acc, playerObj) => {
          let team = playerObj.teamAbbrevs
          if (team && team.length === 3 && !acc.includes(team)) {
            acc.push(team)
          }
          return acc
        }, [])
        .sort()
    : ''
}

export const getCountries = stats =>
  stats
    .reduce((acc, playerObj) => {
      let country = playerObj.playerBirthCountry
      if (country && !acc.includes(country)) {
        acc.push(country)
      }
      return acc
    }, [])
    .sort()

export const getFilteredStats = stats => {
  let dataDisplay = getStarredFilteredStats(stats)
  return dataDisplay
}

export const getSortParams = () => {
  const { orderBy, order } = store.getState().tableSettings
  if (orderBy === 'default') {
    return getDefaultSortParams()
  }
  return [{ property: orderBy, direction: order.toUpperCase() }]
}

export const getDefaultSortParams = () => {
  const { reportName, colConfig } = store.getState().tableSettings
  const [player, report] = reportName.split('-')
  const playerType = player === 'skater' ? 'player' : 'goalie'
  return (
    colConfig?.[`${playerType}ReportData`]?.[report]?.season?.sortKeys
      ?.map(stat => ({
        property: stat,
        direction: sortStatsASC.includes(stat) ? 'ASC_CI' : 'DESC',
      }))
      .reduce((acc, statObj) => [...acc, statObj], []) || [
      { property: `${player}FullName`, direction: 'ASC_CI' },
    ]
  )
}

// const getPositionFilteredStats = stats => {
//   const { playerPositionCode } = store.getState().tableSettings
//   const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true
//   return isSkaters && playerPositionCode !== 'LRCD'
//     ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
//     : stats
// }

const getStarredFilteredStats = stats => {
  const { filterTracked } = store.getState().tableSettings
  const { trackedPlayers } = store.getState().stats
  return filterTracked
    ? stats.filter(obj =>
        trackedPlayers.some(
          listObj =>
            listObj.playerId === obj.playerId &&
            listObj.seasonId === obj.seasonId
        )
      )
    : stats
}

// const getTeamFilteredStats = stats => {
//   const { teamFilter } = store.getState().tableSettings
//   return !teamFilter.includes('all')
//     ? stats.filter(
//         playerObj =>
//           playerObj.teamAbbrevs && teamFilter.includes(playerObj.teamAbbrevs)
//       )
//     : stats
// }

// const getSearchFilteredStats = stats => {
//   const { search } = store.getState().tableSettings
//   return search
//     ? stats.filter(obj => obj.playerName.toLowerCase().includes(search))
//     : stats
// }

// const getCountryFilteredStats = stats => {
//   const { countryFilter } = store.getState().tableSettings
//   return !countryFilter.includes('all')
//     ? stats.filter(
//         playerObj =>
//           playerObj.playerBirthCountry &&
//           countryFilter.includes(playerObj.playerBirthCountry)
//       )
//     : stats
// }
