export const seasonCol = [
  { title: 'Season', id: 'seasonId' },
  { title: 'Track', id: 'track' }, // For adding current season players to dashboard
  { title: 'Team', id: 'playerTeamsPlayedFor' },
]

export const skaterStatsCol = [
  { title: 'Pos', id: 'playerPositionCode' },
  { title: 'GP', id: 'gamesPlayed' },
  { title: 'G', id: 'goals' },
  { title: 'A', id: 'assists' },
  { title: 'P', id: 'points' },
  { title: '+/-', id: 'plusMinus' },
  { title: 'PPG', id: 'ppGoals' },
  { title: 'PPP', id: 'ppPoints' },
  { title: 'SHG', id: 'shGoals' },
  { title: 'SHP', id: 'shPoints' },
  { title: 'P/G', id: 'pointsPerGame' },
  { title: 'Shifts/G', id: 'shiftsPerGame' },
  { title: 'S%', id: 'shootingPctg' },
  { title: 'TOI/G', id: 'timeOnIcePerGame' },
]

export const goalieStatsCol = [
  { title: 'GP', id: 'gamesPlayed' },
  { title: 'GS', id: 'gamesStarted' },
  { title: 'W', id: 'wins' },
  { title: 'L', id: 'losses' },
  { title: 'T', id: 'ties' },
  { title: 'OT', id: 'otLosses' },
  { title: 'SA', id: 'shotsAgainst' },
  { title: 'Svs', id: 'saves' },
  { title: 'GA', id: 'goalsAgainst' },
  { title: 'Sv%', id: 'savePctg' },
  { title: 'GAA', id: 'goalsAgainstAverage' },
  { title: 'TOI', id: 'timeOnIce' },
  { title: 'SO', id: 'shutouts' },
]

export const bioCol = [
  { title: 'Country', id: 'playerBirthCountry' },
  { title: 'DOB', id: 'playerBirthDate' },
  { title: 'Height', id: 'playerHeight' },
  { title: 'Weight', id: 'playerWeight' },
]

export const draftCol = [
  { title: 'Draft #', id: 'playerDraftOverallPickNo' },
  { title: 'Draft Round', id: 'playerDraftRoundNo' },
  { title: 'Draft Year', id: 'playerDraftYear' },
]

export const yearFormatter = cell => {
  let yearsFormat = cell
    .toString()
    .slice()
    .split('')
  yearsFormat.splice(4, 2, '-')
  yearsFormat = yearsFormat.join('')

  return yearsFormat
}

export const stopPropagation = event => {
  event.stopPropagation()
}

export const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

export const getSorting = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy)
}

export const generateCols = data => {
  const aggregateTable = !(data[0]
    ? Object.keys(data[0]).includes('seasonId')
    : false)

  const isSkaters = data[0] ? data[0]['playerPositionCode'] !== 'G' : true

  const playerStatsCol = isSkaters ? skaterStatsCol : goalieStatsCol

  const columns = aggregateTable
    ? [].concat(playerStatsCol, bioCol, draftCol)
    : [].concat(seasonCol, playerStatsCol, bioCol, draftCol)
    
  return columns
}
