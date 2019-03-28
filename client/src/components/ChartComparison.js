import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryLabel,
} from 'victory'
import {
  Input,
  FormControl,
  InputLabel,
  NativeSelect,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { RadioButtonChecked } from '@material-ui/icons'
import chroma from 'chroma-js'
import styled from 'styled-components'
import configure from '../utils/configLocalforage'
import { startLoad, stopLoad } from '../actions/statActions'
import chartTheme from '../helper/chartTheme'
import { skaterLogStats } from '../helper/chartComparisonHelper'
import { secToString } from '../helper/columnLabels'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-family: Roboto, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 12px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`

class ChartComparison extends Component {
  constructor() {
    super()
    this.state = {
      playerData: [],
      playerStat: 'points',
      summed: true,
    }

    this._isMounted = false
  }

  async componentDidMount() {
    const { selectedPlayers, data } = this.props
    this._isMounted = true
    const playerIds = selectedPlayers.map(playerStr => playerStr.split('-')[0])

    if (playerIds.length) {
      this.props.startLoad()
      await configure().then(async api => {
        const playerGameLogs = await Promise.all(
          playerIds.map(playerId =>
            api
              .get(`/api/statistics/players/gameLog/${playerId}`)
              .then(res => res.data)
          )
        )

        const playerData = selectedPlayers.map((tag, i) => {
          const tableData = data.find(
            playerObj => playerObj.playerId === parseInt(playerIds[i])
          )
          return { tag, tableData, gameLog: playerGameLogs[i] }
        })

        if (this._isMounted) {
          this.setState(
            { playerData, activeLines: selectedPlayers.slice() },
            () => {
              this.props.stopLoad()
            }
          )
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

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  render() {
    const { playerData, playerStat, summed } = this.state
    const { dataLoad } = this.props.stats

    if (!playerData)
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <CircularProgress />
        </div>
      )

    const statLabel = skaterLogStats.find(obj => obj.key === playerStat).label

    const formatter = skaterLogStats.find(obj => obj.key === playerStat).format
      ? skaterLogStats.find(obj => obj.key === playerStat).format
      : x => x

    const playerPointProgress = playerData.map(obj => {
      const { gameLog } = obj
      let total = 0
      const orderedGameLog = gameLog.slice().reverse()

      if (['faceOffPct', 'shotPct'].includes(playerStat) || !summed) {
        return orderedGameLog.map(game => {
          let x = Date.parse(game.date)
          return { x, y: game.stat[playerStat] || 0 }
        })
      } else {
        return orderedGameLog.map(game => {
          total += formatter(game.stat[playerStat])
          let x = Date.parse(game.date)
          return { x, y: total }
        })
      }
    })

    const toi = statLabel.includes('TOI')
    const theme = chartTheme(toi)

    const lineNames = playerData.map(obj => `${obj.tag}-line-name`)

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        {dataLoad && <CircularProgress />}
        {playerData.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                paddingBottom: '1rem',
              }}
            >
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
              <FormControlLabel
                control={
                  <Switch
                    checked={summed}
                    onChange={this.handleSwitchChange('summed')}
                  />
                }
                label="Sum Results"
              />
            </div>
            <Legend>
              {playerData.map((obj, i) => (
                <LegendItem key={`${obj.tag}-legend`}>
                  <RadioButtonChecked
                    fontSize="inherit"
                    style={{
                      color: colorFunc(i / playerData.length),
                      marginRight: '0.3rem',
                    }}
                  />
                  {obj.tableData.playerName}
                </LegendItem>
              ))}
            </Legend>
            <VictoryChart
              theme={theme}
              scale={{ x: 'time' }}
              events={[
                {
                  childName: [...lineNames],
                  target: 'data',
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          childName: lineNames,
                          mutation: props => {
                            return {
                              style: Object.assign({}, props.style, {
                                opacity: 0.2,
                              }),
                            }
                          },
                        },
                        {
                          mutation: props => {
                            return {
                              style: Object.assign({}, props.style, {
                                stroke: props.style.stroke,
                                display: 'inline',
                                opacity: 1,
                              }),
                            }
                          },
                        },
                      ]
                    },
                    onMouseOut: () => {
                      return [
                        {
                          childName: lineNames,
                          mutation: () => {
                            return null
                          },
                        },
                      ]
                    },
                  },
                },
              ]}
            >
              {playerPointProgress.map((data, i) => (
                <VictoryLine
                  key={`${playerData[i].tag}-line`}
                  name={`${playerData[i].tag}-line-name`}
                  data={data}
                  animate={{ duration: 2000, onLoad: { duration: 1000 } }}
                  interpolation="step"
                  style={{
                    data: {
                      stroke: colorFunc(i / playerData.length),
                      transition: 'all 0.2s',
                    },
                  }}
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
            </VictoryChart>
          </>
        )}
      </div>
    )
  }
}

ChartComparison.propTypes = {
  selectedPlayers: PropTypes.array.isRequired,
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
