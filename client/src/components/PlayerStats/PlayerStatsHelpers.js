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
