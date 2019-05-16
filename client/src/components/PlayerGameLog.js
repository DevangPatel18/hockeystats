import React, { Component } from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import configure from '../utils/configLocalforage'
import { yearFormatter } from '../helper/columnLabels'

class PlayerGameLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerGameLogData: [],
      teamSchedule: [],
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

      this.setState({ playerGameLogData, teamSchedule })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { onClose, playerObj } = this.props
    const { playerGameLogData, teamSchedule } = this.state

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
      </div>
    )
  }
}

export default PlayerGameLog
