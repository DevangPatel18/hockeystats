import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  IconButton,
  Toolbar,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import configure from '../utils/configLocalforage'
import {
  yearFormatter,
  ProfileSkateCol,
  ProfileGoalieCol,
  gameLogTableColumns,
} from '../helper/columnLabels'
import { teamCodes } from '../helper/teamCodes'

const headerStyle = {
  background: '#C0C0C0',
  fontWeight: '800',
  padding: '0 5px',
  color: 'rgba(0,0,0,0.54)',
  cursor: 'pointer',
}

const tableCellStyle = {
  fontSize: '0.65rem',
  padding: '0 5px',
  borderBottom: '1px solid #D0D0D0',
  borderRight: '1px solid #D0D0D0',
}

const gameLogTableColumnsKeys = gameLogTableColumns.map(gameCol => gameCol.key)

class PlayerGameLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      order: 'asc',
      orderBy: '',
    }

    this._isMounted = false
  }

  async componentDidMount() {
    const { playerObj, dataType } = this.props
    const { playerId, seasonId } = playerObj

    configure().then(async api => {
      const playerGameLogData = await api
        .get(
          `/api/statistics/players/gameLog/playerId/${playerId}/seasonId/${seasonId}/dataType/${dataType}`
        )
        .then(res => res.data.reverse())

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

      let gVar = dataType === 'regular' ? 'R' : 'P'

      let teamSchedule = await Promise.all(
        teamIntervals.map(async intervalParams => {
          const { teamId, startDate, endDate } = intervalParams
          return api
            .get(
              `/api/statistics/team/${teamId}/startDate/${startDate}/endDate/${endDate}`
            )
            .then(res =>
              res.data.dates
                .filter(gameSchedule => gameSchedule.games[0].gameType === gVar)
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

      let temp

      playerGameLogData.forEach((gameLog, i) => {
        temp = teamSchedule.find(game => game.date === gameLog.date)
        temp.playerData = { ...gameLog, game: i + 1 }
      })

      let playerCols =
        playerObj.playerPositionCode !== 'G'
          ? ProfileSkateCol
          : ProfileGoalieCol
      playerCols = playerCols.filter(
        obj =>
          !['games', 'wins', 'losses', 'ties', 'goalAgainstAverage'].includes(
            obj.key
          )
      )
      playerCols.splice(0, 0, { key: 'game', label: 'Game' })

      let date
      let team
      let opponent
      let teamScore
      let opponentScore
      let isHome
      let goalDifference
      let intervalIdx
      let playerStats
      let game

      let tableData = teamSchedule.map(gameLog => {
        date = gameLog.date
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

        team = teamCodes[team]
        opponent = teamCodes[opponent]
        isHome = isHome ? '' : '@'
        goalDifference = teamScore - opponentScore

        return {
          date,
          team,
          teamScore,
          opponent,
          opponentScore,
          isHome,
          goalDifference,
          game,
          ...playerStats,
        }
      })

      this.setState({ tableData, playerCols })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  tableRowHeader = index => {
    const { playerCols, order, orderBy } = this.state
    return (
      <TableRow style={{ height: 'auto' }} key={`row-${index}`}>
        <TableCell
          style={{
            ...headerStyle,
            ...tableCellStyle,
            paddingLeft: '0.5rem',
          }}
        >
          Rank
        </TableCell>
        {gameLogTableColumns.map(colHeader => (
          <TableCell
            key={`${colHeader.label}-${index}`}
            align="center"
            style={{ ...headerStyle, ...tableCellStyle }}
            sortDirection={orderBy === colHeader.key ? order : false}
          >
            <Tooltip
              title={colHeader.key}
              placement={'bottom-end'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === colHeader.key}
                direction={order}
                onClick={() => this.handleRequestSort(colHeader.key)}
                hideSortIcon={true}
              >
                {colHeader.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
        {playerCols.map(statCol => (
          <TableCell
            key={`${statCol.label}-${index}`}
            align="center"
            style={{ ...headerStyle, ...tableCellStyle }}
            sortDirection={orderBy === statCol.key ? order : false}
          >
            <Tooltip
              title={statCol.key}
              placement={'bottom-end'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === statCol.key}
                direction={order}
                onClick={() => this.handleRequestSort(statCol.key)}
                hideSortIcon={true}
              >
                {statCol.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    )
  }

  handleRequestSort = property => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  render() {
    const { onClose, playerObj } = this.props
    const { tableData, playerCols, order, orderBy } = this.state
    const sortSign = order === 'desc' ? -1 : 1

    if (Object.keys(playerObj).length === 0) {
      return null
    }

    let tableDataDisplay = orderBy
      ? tableData.sort((logA, logB) => {
          if (!gameLogTableColumnsKeys.includes(orderBy)) {
            if (!logB.game) {
              return -1
            }
            if (!logA.game && logB.game) {
              return 1
            }
          }
          if (logA[orderBy] === logB[orderBy]) {
            return logA.date > logB.date ? 1 : -1
          }
          return logA[orderBy] > logB[orderBy] ? sortSign : -1 * sortSign
        })
      : tableData

    return (
      <div>
        <AppBar position="static">
          <Toolbar style={{ position: 'relative' }}>
            <IconButton
              color="inherit"
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute' }}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ margin: '0 auto' }}>
              {playerObj.playerName} ({yearFormatter(playerObj.seasonId)})
            </div>
          </Toolbar>
        </AppBar>

        <div
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 65px - 2rem)',
            margin: '1rem',
            border: tableDataDisplay.length ? '1px solid' : '',
            textAlign: 'center',
          }}
        >
          {tableDataDisplay.length ? (
            <Table padding="none" style={{ margin: '0' }}>
              <TableHead>{this.tableRowHeader('header')}</TableHead>
              <TableBody>
                {tableDataDisplay.map((game, i) => (
                  <React.Fragment key={`gameLogRow-${i}`}>
                    {i > 0 && i % 25 === 0 && this.tableRowHeader(i)}
                    <TableRow style={{ height: 'auto' }} hover={true}>
                      <TableCell
                        align="center"
                        style={{ ...tableCellStyle, paddingLeft: '0.5rem' }}
                      >
                        {i + 1}
                      </TableCell>
                      {gameLogTableColumns.map(gameCol => (
                        <TableCell
                          align="center"
                          key={`${gameCol.label}-${i}`}
                          style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}
                        >
                          {game[gameCol.key]}
                        </TableCell>
                      ))}
                      {game['game'] ? (
                        playerCols.map(statCol => (
                          <TableCell
                            align="center"
                            key={`${statCol.label}-g${game['game']}`}
                            style={tableCellStyle}
                          >
                            {statCol.format
                              ? statCol.format(game[statCol.key])
                              : game[statCol.key]}
                          </TableCell>
                        ))
                      ) : (
                        <TableCell
                          colSpan={playerCols.length}
                          align="center"
                          style={tableCellStyle}
                        >
                          INACTIVE
                        </TableCell>
                      )}
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CircularProgress />
          )}
        </div>
      </div>
    )
  }
}

PlayerGameLog.propTypes = {
  onClose: PropTypes.func.isRequired,
  playerObj: PropTypes.object.isRequired,
  dataType: PropTypes.string.isRequired,
}

export default PlayerGameLog
