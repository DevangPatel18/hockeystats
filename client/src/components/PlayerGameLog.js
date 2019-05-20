import React, { Component } from 'react'
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
} from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import configure from '../utils/configLocalforage'
import {
  yearFormatter,
  ProfileSkateCol,
  ProfileGoalieCol,
} from '../helper/columnLabels'
import { teamCodes } from '../helper/teamCodes'

const tableHeaders = ['Game', 'Date', 'Team', 'TG', '-', 'OG', 'Opp', 'Diff']

const headerStyle = {
  background: '#C0C0C0',
  fontWeight: '800',
  padding: '0 5px',
  color: 'rgba(0,0,0,0.54)',
}

const tableCellStyle = {
  fontSize: '0.65rem',
  padding: '0 5px',
  borderBottom: '1px solid #D0D0D0',
  borderRight: '1px solid #D0D0D0',
}

const tableRowHeader = (index, playerCols) => (
  <TableRow style={{ height: 'auto' }}>
    <TableCell
      style={{
        ...headerStyle,
        ...tableCellStyle,
        paddingLeft: '0.5rem',
      }}
    >
      Rank
    </TableCell>
    {tableHeaders.map(colHeader => (
      <TableCell
        key={`${colHeader}-${index}`}
        align="center"
        style={{ ...headerStyle, ...tableCellStyle }}
      >
        {colHeader}
      </TableCell>
    ))}
    {playerCols.map(statCol => (
      <TableCell
        key={`${statCol.label}-header-${index}`}
        align="center"
        style={{ ...headerStyle, ...tableCellStyle }}
      >
        {statCol.label}
      </TableCell>
    ))}
  </TableRow>
)

class PlayerGameLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
    }

    this._isMounted = false
  }

  async componentDidMount() {
    const { playerObj } = this.props
    const { playerId, seasonId } = playerObj

    configure().then(async api => {
      const playerGameLogData = await api
        .get(
          `/api/statistics/players/gameLog/playerId/${playerId}/seasonId/${seasonId}/dataType/regular`
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

      tempInterval.endDate = playerGameLogData[0].season.slice(4) + '-04-20'

      teamIntervals.push(tempInterval)

      let teamSchedule = await Promise.all(
        teamIntervals.map(async intervalParams => {
          const { teamId, startDate, endDate } = intervalParams
          return api
            .get(
              `/api/statistics/team/${teamId}/startDate/${startDate}/endDate/${endDate}`
            )
            .then(res =>
              res.data.dates
                .filter(gameSchedule => gameSchedule.games[0].gameType === 'R')
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

      let date
      let team
      let opponent
      let teamScore
      let opponentScore
      let isHome
      let diff
      let intervalIdx

      let tableData = teamSchedule.map(game => {
        date = game.date
        if (game.playerData) {
          isHome = game.home.team.id === team
          team = game.playerData.team.id
          opponent = game.playerData.opponent.id
        } else {
          intervalIdx = teamIntervals.findIndex(
            interval => date >= interval.startDate && date <= interval.endDate
          )
          team = teamIntervals[intervalIdx].teamId
          isHome = team === game.home.team.id
          opponent = isHome ? game.away.team.id : game.home.team.id
        }
        if (isHome) {
          teamScore = game.home.score
          opponentScore = game.away.score
        } else {
          teamScore = game.away.score
          opponentScore = game.home.score
        }
        diff = teamScore - opponentScore
        return {
          date,
          team,
          teamScore,
          opponent,
          opponentScore,
          isHome,
          diff,
          playerData: game.playerData,
        }
      })

      this.setState({ tableData, playerCols })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { onClose, playerObj } = this.props
    const { tableData, playerCols } = this.state

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
            border: tableData.length ? '1px solid' : '',
            textAlign: 'center',
          }}
        >
          {tableData.length ? (
            <Table padding="none" style={{ margin: '0' }}>
              <TableHead>{tableRowHeader('header', playerCols)}</TableHead>
              <TableBody>
                {tableData.map((game, i) => (
                  <>
                    {i > 0 && i % 25 === 0 && tableRowHeader(i, playerCols)}
                    <TableRow
                      key={`game-${i + 1}`}
                      style={{ height: 'auto' }}
                      hover={true}
                    >
                      <TableCell
                        align="center"
                        style={{ ...tableCellStyle, paddingLeft: '0.5rem' }}
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell align="center" style={tableCellStyle}>
                        {game.playerData ? game.playerData.game : ''}
                      </TableCell>
                      <TableCell
                        style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}
                      >
                        {game.date}
                      </TableCell>
                      <TableCell
                        style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}
                      >
                        {teamCodes[game.team]}
                      </TableCell>
                      <TableCell align="center" style={tableCellStyle}>
                        {game.teamScore}
                      </TableCell>
                      <TableCell align="center" style={tableCellStyle}>
                        {game.isHome ? '' : '@'}
                      </TableCell>
                      <TableCell align="center" style={tableCellStyle}>
                        {game.opponentScore}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}
                      >
                        {teamCodes[game.opponent]}
                      </TableCell>
                      <TableCell align="center" style={tableCellStyle}>
                        {game.diff}
                      </TableCell>
                      {game.playerData ? (
                        playerCols.map(statCol => (
                          <TableCell
                            align="center"
                            key={`${statCol.label}-g${game.playerData.game}`}
                            style={tableCellStyle}
                          >
                            {statCol.format
                              ? statCol.format(
                                  game.playerData.stat[statCol.key]
                                )
                              : game.playerData.stat[statCol.key]}
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
                  </>
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

export default PlayerGameLog
