import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryChart,
  VictoryLine,
  VictoryLabel,
  VictoryLegend,
} from 'victory'
import CircularProgress from '@material-ui/core/CircularProgress'
import chroma from 'chroma-js'
import configure from '../utils/configLocalforage'
import { startLoad, stopLoad } from '../actions/statActions'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

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

    const playerPointProgress = playerData.map(playerGameLog => {
      let total = 0
      return playerGameLog
        .map((game, i) => {
          total += game.stat.points
          return { x: i, y: total }
        })
        .reverse()
    })

    return (
      <div style={{ padding: '2rem' }}>
        {dataLoad && <CircularProgress />}
        {playerData.length > 0 && (
          <VictoryChart>
            {playerPointProgress.map((data, i) => (
              <VictoryLine
                key={`${playerIds[i]}-line`}
                data={data}
                animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                interpolation="natural"
                style={{ data: { stroke: colorFunc(i / playerData.length) } }}
              />
            ))}
            <VictoryLabel
              angle="-90"
              text="Points"
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={10}
              y={150}
            />
            <VictoryLabel
              text="Games"
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={225}
              y={290}
            />
            <VictoryLegend
              data={playerData.map((player, i) => ({
                name: playerObjs[i].playerName,
                symbol: {
                  fill: colorFunc(i / playerData.length),
                },
              }))}
              orientation="horizontal"
              x={0}
              y={0}
            />
          </VictoryChart>
        )}
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
