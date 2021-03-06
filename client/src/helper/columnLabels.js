import store from '../store'
import statAttributes from './statAttributes'

export const seasonCol = [
  { title: 'Season', id: 'seasonId' },
  { title: 'Track', id: 'track' }, // For adding current season players to dashboard
  { title: 'Game logs', id: 'gameLogs' },
  { title: 'Team', id: 'teamAbbrevs' },
]

export const secToString = val => {
  var sec_num = Math.round(val)
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = (sec_num - (hours * 3600 + minutes * 60))
    .toString()
    .padStart(2, '0')

  hours = hours ? `${hours.toString()}:` : ''
  minutes = minutes.toString().padStart(2, '0')

  return `${hours}${minutes}:${seconds}`
}

export const skaterStatsCol = [
  { title: 'Pos', id: 'positionCode' },
  { title: 'GP', id: 'gamesPlayed' },
  { title: 'G', id: 'goals' },
  { title: 'A', id: 'assists' },
  { title: 'P', id: 'points' },
  { title: '+/-', id: 'plusMinus' },
  { title: 'PPG', id: 'ppGoals' },
  { title: 'PPP', id: 'ppPoints' },
  { title: 'SHG', id: 'shGoals' },
  { title: 'SHP', id: 'shPoints' },
  { title: 'P/G', id: 'pointsPerGame', format: val => val.toFixed(2) },
  // { title: 'Shifts/G', id: 'shiftsPerGame', format: val => val.toFixed(1) },
  { title: 'S%', id: 'shootingPct', format: val => (val * 100).toFixed(1) },
  { title: 'TOI/G', id: 'timeOnIcePerGame', format: val => secToString(val) },
]

export const goalieStatsCol = [
  { title: 'GP', id: 'gamesPlayed' },
  { title: 'GS', id: 'gamesStarted' },
  { title: 'W', id: 'wins' },
  { title: 'L', id: 'losses', sortReverse: true },
  { title: 'T', id: 'ties' },
  { title: 'OT', id: 'otLosses' },
  { title: 'SA', id: 'shotsAgainst' },
  { title: 'Svs', id: 'saves' },
  { title: 'GA', id: 'goalsAgainst', sortReverse: true },
  { title: 'Sv%', id: 'savePct', format: val => val.toFixed(3) },
  {
    title: 'GAA',
    id: 'goalsAgainstAverage',
    sortReverse: true,
    format: val => val.toFixed(2),
  },
  { title: 'TOI', id: 'timeOnIce', format: val => secToString(val) },
  { title: 'SO', id: 'shutouts' },
]

export const bioCol = [
  { title: 'Country', id: 'playerBirthCountry' },
  { title: 'DOB', id: 'playerBirthDate' },
  { title: 'Height', id: 'playerHeight' },
  { title: 'Weight', id: 'playerWeight' },
]

export const draftCol = [
  { title: 'Draft #', id: 'playerDraftOverallPickNo', sortReverse: true },
  { title: 'Draft Round', id: 'playerDraftRoundNo', sortReverse: true },
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
  if (!data.length) return skaterStatsCol
  const { playerType, reportType } = store.getState().playerData
  const { colConfig } = store.getState().tableSettings

  const statsList = Object.keys(data[0])
  const seasonIdindex = statsList.indexOf('seasonId')
  const reportKey = `${playerType === 'skater' ? 'player' : 'goalie'}ReportData`
  const columnKey = reportType === 'bios' ? 'displayItems' : 'resultFilters'
  let playerStatsCol =
    colConfig[reportKey]?.[reportType]?.season?.[columnKey] || statsList
  playerStatsCol = playerStatsCol.filter(
    stat =>
      !['seasonId', 'teamAbbrevs', 'playerId'].includes(stat) &&
      stat.slice(-4) !== 'Name'
  )

  playerStatsCol = playerStatsCol.map(x => ({
    title: (statAttributes[x] && statAttributes[x].title) || x,
    id: x,
    format: statAttributes[x] && statAttributes[x].format,
  }))

  const columns =
    seasonIdindex < 0
      ? [].concat(playerStatsCol)
      : [].concat(seasonCol, playerStatsCol)

  return columns
}

export const ProfileSkateCol = [
  { key: 'games', label: 'GP' },
  { key: 'goals', label: 'G' },
  { key: 'assists', label: 'A' },
  { key: 'points', label: 'P' },
  { key: 'plusMinus', label: '+/-' },
  { key: 'pim', label: 'PIM' },
  { key: 'powerPlayGoals', label: 'PPG' },
  { key: 'powerPlayPoints', label: 'PPP' },
  { key: 'powerPlayTimeOnIce', label: 'PP/TOI' },
  { key: 'shortHandedGoals', label: 'SHG' },
  { key: 'shortHandedPoints', label: 'SHP' },
  { key: 'shortHandedTimeOnIce', label: 'SH/TOI' },
  { key: 'gameWinningGoals', label: 'GWG' },
  { key: 'overTimeGoals', label: 'OTG' },
  { key: 'timeOnIce', label: 'TOI' },
  { key: 'shifts', label: 'Shifts' },
  { key: 'shots', label: 'S' },
  { key: 'shotPct', label: 'S%' },
  { key: 'faceOffPct', label: 'FO%' },
  { key: 'blocked', label: 'Blocks' },
  { key: 'hits', label: 'Hits' },
]

const svPercentFormat = val => (val ? (val / 100).toFixed(3) : '')

export const ProfileGoalieCol = [
  { key: 'games', label: 'GP' },
  { key: 'gamesStarted', label: 'GS' },
  { key: 'wins', label: 'W' },
  { key: 'losses', label: 'L' },
  { key: 'ties', label: 'T' },
  { key: 'ot', label: 'OT' },
  { key: 'shotsAgainst', label: 'SA' },
  { key: 'saves', label: 'S' },
  { key: 'savePercentage', label: 'Sv%', format: val => val.toFixed(3) },
  { key: 'goalsAgainst', label: 'GA' },
  { key: 'goalAgainstAverage', label: 'GAA' },
  { key: 'shutouts', label: 'SO' },
  { key: 'timeOnIce', label: 'TOI' },
  { key: 'powerPlayShots', label: 'PPSA' },
  { key: 'powerPlaySaves', label: 'PPS' },
  { key: 'powerPlaySavePercentage', label: 'PPSv%', format: svPercentFormat },
  { key: 'shortHandedShots', label: 'SHSA' },
  { key: 'shortHandedSaves', label: 'SHS' },
  { key: 'shortHandedSavePercentage', label: 'SHSv%', format: svPercentFormat },
  { key: 'evenShots', label: 'ESSA' },
  { key: 'evenSaves', label: 'ESS' },
  {
    key: 'evenStrengthSavePercentage',
    label: 'ESSv%',
    format: svPercentFormat,
  },
]

export const gameLogTableColumns = [
  { key: 'date', label: 'Date' },
  { key: 'team', label: 'Team' },
  { key: 'teamScore', label: 'TG' },
  { key: 'isHome', label: '-' },
  { key: 'opponentScore', label: 'OG' },
  { key: 'opponent', label: 'Opp' },
  { key: 'goalDifference', label: 'Diff' },
]
