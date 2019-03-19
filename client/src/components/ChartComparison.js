import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import configure from '../utils/configLocalforage'
import { startLoad, stopLoad } from '../actions/statActions'

class ChartComparison extends Component {
  constructor() {
    super()
    this.state = {
      playerData: [],
    }

    this._isMounted = false
  }

  async componentDidMount() {
    const { players } = this.props
    this._isMounted = true
    const playerIds = players.map(playerStr => playerStr.split('-')[0])

    if (playerIds.length) {
      this.props.startLoad()
      await configure().then(async api => {
        const playerData = await Promise.all(
          playerIds.map(playerId =>
            api
              .get(`/api/statistics/players/gameLog/${playerId}`)
              .then(res => res.data)
          )
        )
        if (this._isMounted) {
          this.setState({ playerData }, () => {
            this.props.stopLoad()
          })
        }
      })
    }
    console.log(playerIds)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { playerData } = this.state
    const { players, data, stats } = this.props
    const { dataLoad } = stats
    const playerIds = players.map(playerStr => playerStr.split('-')[0])
    const playerObjs = playerIds.map(playerId =>
      data.find(playerObj => playerObj.playerId === parseInt(playerId))
    )

    return (
      <div style={{ padding: '2rem' }}>
        {dataLoad && <CircularProgress />}
        {playerData.length > 0 &&
          playerData.map((player, i) => {
            const { stat, team, opponent } = player[0]
            const { goals, assists, points, timeOnIce } = stat
            return (
              <div key={playerIds[i]} style={{marginBottom: '1rem'}}>
                <h4>{playerObjs[i].playerName}</h4>
                <div>
                  Recent game: {team.name} vs {opponent.name}
                </div>
                <div>
                  G: {goals} - A: {assists} - P: {points} - TOI: {timeOnIce}
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}

ChartComparison.propTypes = {
  players: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  stats: PropTypes.object.isRequired,
  startLoad: PropTypes.func.isRequired,
  stopLoad: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(
  mapStateToProps,
  { startLoad, stopLoad }
)(ChartComparison)
