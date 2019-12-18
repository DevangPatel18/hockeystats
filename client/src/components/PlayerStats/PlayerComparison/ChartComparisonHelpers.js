import {
  skaterLogStats,
  goalieLogStats,
} from '../../../helper/chartComparisonOptions'
import store from '../../../store'

export async function getGameLogData(api) {
  const { playerIds } = this.props
  const isAggregate = playerIds[0][1] ? false : true
  const getPlayerDataFunction = isAggregate
    ? this.getPlayerAggregateData
    : this.getPlayerSeasonData
  const gameLogCollection = await Promise.all(
    playerIds.map(playerArr => getPlayerDataFunction(api, playerArr))
  )
  return isAggregate ? gameLogCollection.flat() : gameLogCollection
}

export function getPlayerSeasonData(api, playerArr) {
  const { dataType } = this.props.playerData
  const [playerId, seasonId] = playerArr
  return api
    .get(
      `/api/statistics/players/gameLog/playerId/${playerId}/seasonId/${seasonId}/dataType/${dataType}`
    )
    .then(res => res.data.reverse())
}

export function getPlayerAggregateData(api, playerArr) {
  const { tableSettings } = this.props
  const { yearStart, yearEnd } = tableSettings
  const playerId = playerArr[0]
  const count = yearEnd.slice(0, 4) - yearStart.slice(0, 4) + 1
  let seasonIdArr = []
  let yearBase = yearStart.slice(0, 4)
  let tempSeasonId

  for (let i = 1; i < count + 1; i++) {
    tempSeasonId = yearBase.concat(parseInt(yearBase) + 1)
    seasonIdArr.push(tempSeasonId)
    yearBase = (parseInt(yearBase) + 1).toString()
  }

  return getPlayerLogDataFromSeasons(api, seasonIdArr, playerId)
}

const getPlayerLogDataFromSeasons = (api, seasonIdArr, playerId) => {
  const { dataType } = store.getState().playerData
  return Promise.all(
    seasonIdArr.map(async seasonId =>
      api
        .get(
          `/api/statistics/players/gameLog/playerId/${playerId}/seasonId/${seasonId}/dataType/${dataType}`
        )
        .then(res => res.data.reverse())
    )
  )
}

export function getStatOptions(gameLogCollection) {
  const { playerType } = this.props.playerData
  let allStatOptions = playerType === 'skater' ? skaterLogStats : goalieLogStats
  let statOptions = []
  for (const playerGameLogArr of gameLogCollection) {
    for (const playerGameLog of playerGameLogArr) {
      for (const statKey in playerGameLog.stat) {
        if (!statOptions.includes(statKey)) {
          statOptions.push(statKey)
        }
      }
    }
  }
  return allStatOptions.filter(statObj => statOptions.includes(statObj.key))
}

export function getPlayerData(gameLogCollection) {
  const { selectedPlayers, playerIds, data } = this.props
  return selectedPlayers.map((tag, i) => {
    const tableData = data.find(
      playerObj => playerObj.playerId === parseInt(playerIds[i])
    )
    return {
      tag,
      tableData,
      gameLog: gameLogCollection[i],
    }
  })
}

export const getDateRange = (gameLogCollection, sameSeason) => {
  if (sameSeason) {
    const minDateArr = []
    const maxDateArr = []
    gameLogCollection.forEach(playerGameLogArr => {
      minDateArr.push(playerGameLogArr[0].date)
      maxDateArr.push(playerGameLogArr[playerGameLogArr.length - 1].date)
    })
    const presentDay = new Date()
    let startDate = new Date(minDateArr.reduce((a, b) => (a < b ? a : b)))
    let endDate = new Date(maxDateArr.reduce((a, b) => (a > b ? a : b)))
    endDate = endDate > presentDay ? presentDay : endDate
    return { startDate, endDate }
  }
  return { startDate: '', endDate: '' }
}

export function getSeasonData() {
  const { selectedPlayers, playerIds, tableSettings } = this.props
  const { yearStart, yearEnd } = tableSettings
  let seasonIds
  let sameSeason
  if (playerIds[0][1]) {
    seasonIds = selectedPlayers.map(playerTag => playerTag.split('-')[1])
    sameSeason = seasonIds.every(seasonId => seasonId === seasonIds[0])
  } else {
    seasonIds = selectedPlayers.map(() =>
      yearStart.slice(0, 4).concat(yearEnd.slice(-4))
    )
    sameSeason = false
  }
  return { seasonIds, sameSeason }
}

export function handleDisplayData() {
  const {
    summed,
    percentAvg,
    playerData,
    playerStat,
    statOptions,
    sameSeason,
  } = this.state

  const formatter = getStatsFormatter(statOptions, playerStat)
  const isPctg = playerStat.includes('Pct') || playerStat.includes('Percentage')
  const domainFn = getDomainFunction(sameSeason)

  return playerData.map(({ gameLog }) => {
    const orderedGameLog = this.filterLogDataByDate(gameLog.slice())
    if ((isPctg && !percentAvg) || !summed) {
      return orderedGameLog.map((game, i) => ({
        x: domainFn(game.date, i),
        y: formatter(game.stat[playerStat]),
      }))
    } else {
      const rangeFn = getRangeFunction(isPctg, percentAvg)
      let total = 0
      return orderedGameLog.map((game, i) => {
        total += formatter(game.stat[playerStat])
        return { x: domainFn(game.date, i), y: rangeFn(total, i) }
      })
    }
  })
}

export function filterLogDataByDate(gameLog) {
  const { sameSeason, startDate, endDate } = this.state
  if (sameSeason) {
    const startDateIso = startDate.toISOString().slice(0, 10)
    const endDateIso = endDate.toISOString().slice(0, 10)

    // Filter games based on date selection for sameSeason comparisons
    return gameLog.filter(
      game => game.date > startDateIso && game.date < endDateIso
    )
  }
  return gameLog
}

const getStatsFormatter = (statOptions, playerStat) => {
  const statObj = statOptions.find(obj => obj.key === playerStat)
  return statObj.format ? statObj.format : x => (x ? x : 0)
}

const getDomainFunction = sameSeason =>
  sameSeason ? (date, __) => Date.parse(date) : (__, i) => i

const getRangeFunction = (isPctg, percentAvg) =>
  isPctg && percentAvg ? (total, i) => total / (i + 1) : (total, __) => total
