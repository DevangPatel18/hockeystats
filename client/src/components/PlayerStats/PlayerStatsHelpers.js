import store from '../../store'

export const fetchData = api => {
  const {
    yearStart,
    yearEnd,
    reportName,
    isAggregate,
    playoffs,
    page,
    rowsPerPage,
    order,
    orderBy,
  } = store.getState().tableSettings

  return api
    .get(
      `/api/statistics/${isAggregate.toString()}/${reportName}/${yearStart}/${yearEnd}/${playoffs}/${page}/${rowsPerPage}/${order}/${orderBy}`
    )
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
  let dataDisplay = getPositionFilteredStats(stats)
  dataDisplay = getStarredFilteredStats(dataDisplay)
  dataDisplay = getTeamFilteredStats(dataDisplay)
  dataDisplay = getSearchFilteredStats(dataDisplay)
  dataDisplay = getCountryFilteredStats(dataDisplay)
  return dataDisplay
}

const getPositionFilteredStats = stats => {
  const { playerPositionCode } = store.getState().tableSettings
  const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true
  return isSkaters && playerPositionCode !== 'LRCD'
    ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
    : stats
}

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

const getTeamFilteredStats = stats => {
  const { teamFilter } = store.getState().tableSettings
  return !teamFilter.includes('all')
    ? stats.filter(
        playerObj =>
          playerObj.teamAbbrevs && teamFilter.includes(playerObj.teamAbbrevs)
      )
    : stats
}

const getSearchFilteredStats = stats => {
  const { search } = store.getState().tableSettings
  return search
    ? stats.filter(obj => obj.playerName.toLowerCase().includes(search))
    : stats
}

const getCountryFilteredStats = stats => {
  const { countryFilter } = store.getState().tableSettings
  return !countryFilter.includes('all')
    ? stats.filter(
        playerObj =>
          playerObj.playerBirthCountry &&
          countryFilter.includes(playerObj.playerBirthCountry)
      )
    : stats
}
