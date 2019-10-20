import {
  skaterLogStats,
  goalieLogStats,
} from '../../../helper/chartComparisonHelper'
import store from '../../../store'

export async function getGameLogData(api, playerIds) {
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
  const { data } = this.props
  let allStatOptions =
    data[0].playerPositionCode !== 'G' ? skaterLogStats : goalieLogStats
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
  const { selectedPlayers, data } = this.props
  const playerIds = selectedPlayers.map(playerStr => playerStr.split('-'))
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
