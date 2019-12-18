import { ProfileSkateCol, ProfileGoalieCol } from '../../helper/columnLabels'
import { teamCodes } from '../../helper/teamCodes'
import store from '../../store'

export const getPlayerGameLogData = api => {
  const { playerObj } = store.getState().stats
  const { playerId, seasonId } = playerObj
  const dataType = store.getState().playerData.dataType || 'regular'
  return api
    .get(
      `/api/statistics/players/gameLog/playerId/${playerId}/seasonId/${seasonId}/dataType/${dataType}`
    )
    .then(res => res.data.reverse())
}

export const getTeamIntervals = playerGameLogData => {
  let tempInterval = {
    teamId: playerGameLogData[0].team.id,
    startDate: playerGameLogData[0].season.slice(0, 4) + '-09-20',
  }

  const teamIntervals = playerGameLogData.reduce((acc, gameLog, i) => {
    if (gameLog.team.id !== tempInterval.teamId) {
      tempInterval.endDate = playerGameLogData[i - 1].date
      acc.push(tempInterval)
      tempInterval = {
        teamId: gameLog.team.id,
        startDate: gameLog.date,
      }
    }
    return acc
  }, [])

  tempInterval.endDate = playerGameLogData[0].season.slice(4) + '-06-20'

  teamIntervals.push(tempInterval)

  return teamIntervals
}

export const getTeamSchedule = async (api, teamIntervals) => {
  let teamSchedule = await Promise.all(
    teamIntervals.map(async intervalParams => {
      const { teamId, startDate, endDate } = intervalParams
      return api
        .get(
          `/api/statistics/team/${teamId}/startDate/${startDate}/endDate/${endDate}`
        )
        .then(res => generateScheduleData(res))
    })
  )
  return teamSchedule.reduce((acc, schedule) => acc.concat(...schedule), [])
}

const generateScheduleData = res => {
  const dataType = store.getState().playerData.dataType || 'regular'
  const dataTypeShort = dataType === 'regular' ? 'R' : 'P'
  return res.data.dates
    .filter(gameSchedule => gameSchedule.games[0].gameType === dataTypeShort)
    .map(gameSchedule => ({
      date: gameSchedule.date,
      home: gameSchedule.games[0].teams.home,
      away: gameSchedule.games[0].teams.away,
    }))
}

export const copyPlayerDataToSchedule = (teamSchedule, playerGameLogData) => {
  playerGameLogData.forEach((gameLog, i) => {
    let gameLogData = teamSchedule.find(game => game.date === gameLog.date)
    if (gameLogData) {
      gameLogData.playerData = { ...gameLog, game: i + 1 }
    }
  })
}

export const getPlayerStatColumns = () => {
  const { playerObj } = store.getState().stats
  const playerPosition = playerObj.positionCode || playerObj.playerPositionCode
  let playerCols = playerPosition !== 'G' ? ProfileSkateCol : ProfileGoalieCol
  playerCols = playerCols.filter(
    obj =>
      !['games', 'wins', 'losses', 'ties', 'goalAgainstAverage'].includes(
        obj.key
      )
  )
  playerCols.splice(0, 0, { key: 'game', label: 'Game' })
  return playerCols
}

export const getTableData = (teamSchedule, teamIntervals) =>
  teamSchedule.map(gameLog => {
    const data = gameLog.playerData
      ? getActivePlayerGameData(gameLog)
      : getInactivePlayerGameData(gameLog, teamIntervals)

    data.date = gameLog.date
    data.opponentScore = data.isHome ? gameLog.away.score : gameLog.home.score
    data.teamScore = data.isHome ? gameLog.home.score : gameLog.away.score
    data.team = teamCodes[data.team]
    data.opponent = teamCodes[data.opponent]
    data.isHome = data.isHome ? '' : '@'
    data.goalDifference = data.teamScore - data.opponentScore

    return { ...data, ...data.playerStats }
  })

const getActivePlayerGameData = gameLog => ({
  team: gameLog.playerData.team.id,
  isHome: gameLog.home.team.id === gameLog.playerData.team.id,
  opponent: gameLog.playerData.opponent.id,
  playerStats: gameLog.playerData.stat,
  game: gameLog.playerData.game,
})

const getInactivePlayerGameData = (gameLog, teamIntervals) => {
  const intervalIdx = teamIntervals.findIndex(
    interval =>
      gameLog.date >= interval.startDate && gameLog.date <= interval.endDate
  )
  const team = teamIntervals[intervalIdx].teamId
  const isHome = team === gameLog.home.team.id
  return {
    team,
    isHome,
    opponent: isHome ? gameLog.away.team.id : gameLog.home.team.id,
    playerStats: null,
    game: null,
  }
}
