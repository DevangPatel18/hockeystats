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
  const dataType = store.getState().playerData.dataType || 'regular'
  const dataTypeShort = dataType === 'regular' ? 'R' : 'P'

  let teamSchedule = await Promise.all(
    teamIntervals.map(async intervalParams => {
      const { teamId, startDate, endDate } = intervalParams
      return api
        .get(
          `/api/statistics/team/${teamId}/startDate/${startDate}/endDate/${endDate}`
        )
        .then(res =>
          res.data.dates
            .filter(
              gameSchedule => gameSchedule.games[0].gameType === dataTypeShort
            )
            .map(gameSchedule => ({
              date: gameSchedule.date,
              home: gameSchedule.games[0].teams.home,
              away: gameSchedule.games[0].teams.away,
            }))
        )
    })
  )

  teamSchedule = teamSchedule.reduce(
    (acc, schedule) => acc.concat(...schedule),
    []
  )

  return teamSchedule
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
  console.log(playerObj)
  let playerCols =
    playerObj.playerPositionCode !== 'G' ? ProfileSkateCol : ProfileGoalieCol
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
    const date = gameLog.date
    let team
    let opponent
    let teamScore
    let opponentScore
    let isHome
    let intervalIdx
    let playerStats
    let game

    if (gameLog.playerData) {
      team = gameLog.playerData.team.id
      isHome = gameLog.home.team.id === team
      opponent = gameLog.playerData.opponent.id
      playerStats = gameLog.playerData.stat
      game = gameLog.playerData.game
    } else {
      intervalIdx = teamIntervals.findIndex(
        interval => date >= interval.startDate && date <= interval.endDate
      )
      team = teamIntervals[intervalIdx].teamId
      isHome = team === gameLog.home.team.id
      opponent = isHome ? gameLog.away.team.id : gameLog.home.team.id
      playerStats = null
      game = null
    }

    if (isHome) {
      teamScore = gameLog.home.score
      opponentScore = gameLog.away.score
    } else {
      teamScore = gameLog.away.score
      opponentScore = gameLog.home.score
    }

    return {
      date,
      team: teamCodes[team],
      opponent: teamCodes[opponent],
      teamScore,
      opponentScore,
      isHome: isHome ? '' : '@',
      goalDifference: teamScore - opponentScore,
      game,
      ...playerStats,
    }
  })
