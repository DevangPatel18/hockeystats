import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryLabel,
  VictoryLegend,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory'
import { Input, FormControl, InputLabel, NativeSelect } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import chroma from 'chroma-js'
import configure from '../utils/configLocalforage'
import { startLoad, stopLoad } from '../actions/statActions'
import chartTheme from '../helper/chartTheme'
import { skaterLogStats } from '../helper/chartComparisonHelper'
import { secToString } from '../helper/columnLabels'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

class ChartComparison extends Component {
  constructor() {
    super()
    this.state = {
      playerData: [],
      playerStat: 'points',
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

  handleStatChange = e => {
    this.setState({ playerStat: e.target.value })
  }

  render() {
    const { playerData, playerStat } = this.state
    const { players, data, stats } = this.props
    const { dataLoad } = stats
    const playerIds = players.map(playerStr => playerStr.split('-')[0])
    const playerObjs = playerIds.map(playerId =>
      data.find(playerObj => playerObj.playerId === parseInt(playerId))
    )

    const statLabel = skaterLogStats.find(obj => obj.key === playerStat).label

    const formatter = skaterLogStats.find(obj => obj.key === playerStat).format
      ? skaterLogStats.find(obj => obj.key === playerStat).format
      : x => x
    const playerPointProgress = playerData.map(playerGameLog => {
      let total = 0
      const orderedGameLog = playerGameLog.slice().reverse()
      return orderedGameLog.map(game => {
        total += formatter(game.stat[playerStat])
        let x = Date.parse(game.date)
        return { x, y: total }
      })
    })

    const toi = statLabel.includes('TOI')
    const theme = chartTheme(toi)

    return (
      <div style={{ padding: '2rem' }}>
        {dataLoad && <CircularProgress />}
        {playerData.length > 0 && (
          <>
            <div>
              <FormControl>
                <InputLabel htmlFor="playerStat">Statistic</InputLabel>
                <NativeSelect
                  value={playerStat}
                  onChange={this.handleStatChange}
                  input={<Input name="playerStat" id="playerStat" />}
                >
                  {skaterLogStats.map(stat => (
                    <option value={stat.key} key={stat.key}>
                      {stat.label}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </div>
            <VictoryChart
              theme={theme}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryVoronoiContainer
                  voronoiDimension="x"
                  labels={d => {
                    const date = new Date(d.x)
                    const dateStr = date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      timeZome: 'UTC',
                    })
                    return `${dateStr}, ${d.y}`
                  }}
                  labelComponent={<VictoryTooltip />}
                />
              }
            >
              {playerPointProgress.map((data, i) => (
                <VictoryLine
                  key={`${playerIds[i]}-line`}
                  data={data}
                  animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                  style={{ data: { stroke: colorFunc(i / playerData.length) } }}
                />
              ))}
              {toi && <VictoryAxis dependentAxis tickFormat={secToString} />}
              {toi && <VictoryAxis />}
              <VictoryLabel
                angle="-90"
                text={statLabel}
                textAnchor="middle"
                style={{ fontWeight: 'bolder' }}
                x={10}
                y={150}
              />
              <VictoryLabel
                text="Date"
                textAnchor="middle"
                style={{ fontWeight: 'bolder' }}
                x={225}
                y={340}
              />
              <VictoryLegend
                data={playerData.map((player, i) => ({
                  name: playerObjs[i].playerName,
                  symbol: {
                    fill: colorFunc(i / playerData.length),
                  },
                }))}
                x={toi ? 80 : 50}
              />
            </VictoryChart>
          </>
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
