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

      this.setState({ playerGameLogData })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { onClose, playerObj } = this.props
    const { playerGameLogData } = this.state

    console.log(playerGameLogData)

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
