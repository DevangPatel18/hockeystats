import store from '../../store'

export const fetchData = api => {
  const {
    yearStart,
    yearEnd,
    reportName,
    isAggregate,
    playoffs,
  } = store.getState().tableSettings

  return api
    .get(
      `/api/statistics/${isAggregate.toString()}/${reportName}/${yearStart}/${yearEnd}/${playoffs}`
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
          let team = playerObj.playerTeamsPlayedFor
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
  const {
    filterTracked,
    search,
    playerPositionCode,
    teamFilter,
    countryFilter,
  } = store.getState().tableSettings
  const { trackedPlayers } = store.getState().stats

  const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true

  let dataDisplay = isSkaters
    ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
    : stats

  dataDisplay = filterTracked
    ? dataDisplay.filter(obj =>
        trackedPlayers.some(
          listObj =>
            listObj.playerId === obj.playerId &&
            listObj.seasonId === obj.seasonId
        )
      )
    : dataDisplay

  dataDisplay =
    teamFilter !== 'all'
      ? dataDisplay.filter(
          playerObj =>
            playerObj.playerTeamsPlayedFor &&
            playerObj.playerTeamsPlayedFor.includes(teamFilter)
        )
      : dataDisplay

  dataDisplay = search
    ? dataDisplay.filter(obj => obj.playerName.toLowerCase().includes(search))
    : dataDisplay

  dataDisplay =
    countryFilter !== 'all'
      ? dataDisplay.filter(
          playerObj => playerObj.playerBirthCountry === countryFilter
        )
      : dataDisplay

  return dataDisplay
}
