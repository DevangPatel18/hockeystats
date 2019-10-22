import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Input,
  FormControl,
  InputLabel,
  NativeSelect,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons'
import chroma from 'chroma-js'
import styled from 'styled-components'
import { DatePicker } from 'material-ui-pickers'
import configure from '../../../utils/configLocalforage'
import { startLoad, stopLoad } from '../../../actions/statActions'
import StatsChart from './StatsChart'
import * as cch from './ChartComparisonHelpers'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 0.8rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  cursor: pointer;
`

const yearFormat = seasonId => {
  const seasonIdFormat = seasonId.split('')
  seasonIdFormat.splice(4, 0, '-')
  return `(${seasonIdFormat.join('')})`
}

class ChartComparison extends Component {
  constructor() {
    super()
    this.state = {
      playerData: [],
      playerStat: '',
      summed: true,
      percentAvg: false,
      activeLines: '',
      hover: '',
      statOptions: '',
      startDate: '',
      endDate: '',
    }

    this.getGameLogData = cch.getGameLogData.bind(this)
    this.getPlayerSeasonData = cch.getPlayerSeasonData.bind(this)
    this.getPlayerAggregateData = cch.getPlayerAggregateData.bind(this)
    this.getStatOptions = cch.getStatOptions.bind(this)
    this.getPlayerData = cch.getPlayerData.bind(this)
    this.getSeasonData = cch.getSeasonData.bind(this)
    this.handleDisplayData = cch.handleDisplayData.bind(this)
    this.filterLogDataByDate = cch.filterLogDataByDate.bind(this)

    this._isMounted = false
  }

  async componentDidMount() {
    const { selectedPlayers } = this.props
    this._isMounted = true
    if (selectedPlayers.length) {
      this.props.startLoad()
      await configure().then(async api => {
        const gameLogCollection = await this.getGameLogData(api)
        const statOptions = this.getStatOptions(gameLogCollection)
        const playerData = this.getPlayerData(gameLogCollection)
        const { seasonIds, sameSeason } = this.getSeasonData()
        const { startDate, endDate } = cch.getDateRange(
          gameLogCollection,
          sameSeason
        )
        if (this._isMounted) {
          this.setState(
            {
              playerData,
              activeLines: selectedPlayers.slice(),
              statOptions,
              playerStat: statOptions[0].key,
              seasonIds,
              sameSeason,
              startDate,
              endDate,
              minDate: startDate,
              maxDate: endDate,
            },
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

  toggleLines = tag => {
    const newActiveLines = this.state.activeLines.slice()
    const tagIndex = newActiveLines.indexOf(tag)
    if (tagIndex === -1) {
      newActiveLines.push(tag)
    } else {
      newActiveLines.splice(tagIndex, 1)
    }
    this.setState({ activeLines: newActiveLines })
  }

  onChangeDate = name => event => {
    this.setState({ [name]: event })
  }

  handleLoadingAnimation = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <CircularProgress />
    </div>
  )

  render() {
    const {
      playerData,
      playerStat,
      summed,
      percentAvg,
      activeLines,
      hover,
      statOptions,
      startDate,
      endDate,
      seasonIds,
      sameSeason,
      minDate,
      maxDate,
    } = this.state

    if (!playerStat) return this.handleLoadingAnimation()

    const statObj = statOptions.find(obj => obj.key === playerStat)
    const statLabel = statObj.label
    const selectedPlayerData = playerData.filter(obj =>
      activeLines.includes(obj.tag)
    )
    const statPercentage =
      playerStat.includes('Pct') || playerStat.includes('Percentage')
    const toi = statLabel.includes('TOI')
    const lineNames = selectedPlayerData.map(obj => `${obj.tag}-line-name`)
    const dataSet = this.handleDisplayData()

    const StatChartProps = {
      toi,
      sameSeason,
      lineNames,
      statLabel,
      playerData,
      activeLines,
      hover,
      dataSet,
    }

    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        {playerData.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                height: '6.5rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginRight: '1rem',
                }}
              >
                <FormControl>
                  <InputLabel htmlFor="playerStat">Statistic</InputLabel>
                  <NativeSelect
                    value={playerStat}
                    onChange={this.handleStatChange}
                    input={<Input name="playerStat" id="playerStat" />}
                    style={{ marginRight: '1rem' }}
                  >
                    {statOptions.map(stat => (
                      <option value={stat.key} key={stat.key}>
                        {stat.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <DatePicker
                  autoOk
                  label="From"
                  disableFuture
                  value={startDate}
                  onChange={this.onChangeDate('startDate')}
                  animateYearScrolling={false}
                  minDate={minDate}
                  maxDate={endDate}
                  style={{
                    display: sameSeason ? 'flex' : 'none',
                    marginRight: '1rem',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                {statPercentage ? (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={percentAvg}
                        onChange={this.handleSwitchChange('percentAvg')}
                        disabled={!statPercentage}
                      />
                    }
                    label="Running Average"
                  />
                ) : (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={summed}
                        onChange={this.handleSwitchChange('summed')}
                        disabled={statPercentage}
                      />
                    }
                    label="Sum Results"
                  />
                )}
                <DatePicker
                  autoOk
                  label="To"
                  disableFuture
                  value={endDate}
                  onChange={this.onChangeDate('endDate')}
                  animateYearScrolling={false}
                  minDate={startDate}
                  maxDate={maxDate}
                  style={{ display: sameSeason ? 'flex' : 'none' }}
                />
              </div>
            </div>
            <Legend>
              {playerData.map((obj, i) => (
                <LegendItem
                  key={`${obj.tag}-legend`}
                  onClick={() => this.toggleLines(obj.tag)}
                  onMouseEnter={() => this.setState({ hover: obj.tag })}
                  onMouseLeave={() => this.setState({ hover: '' })}
                >
                  {activeLines.includes(obj.tag) ? (
                    <RadioButtonChecked
                      fontSize="inherit"
                      style={{
                        color: colorFunc(i / playerData.length),
                        marginRight: '0.3rem',
                      }}
                    />
                  ) : (
                    <RadioButtonUnchecked
                      fontSize="inherit"
                      style={{
                        color: colorFunc(i / playerData.length),
                        marginRight: '0.3rem',
                      }}
                    />
                  )}
                  {obj.tableData.playerName}{' '}
                  {!sameSeason ? yearFormat(seasonIds[i]) : ''}
                </LegendItem>
              ))}
            </Legend>
            <div style={{ height: '60vh' }}>
              <StatsChart {...StatChartProps} />
            </div>
          </>
        )}
      </div>
    )
  }
}

ChartComparison.propTypes = {
  selectedPlayers: PropTypes.array.isRequired,
  playerIds: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  stats: PropTypes.object.isRequired,
  playerData: PropTypes.object.isRequired,
  startLoad: PropTypes.func.isRequired,
  stopLoad: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
  tableSettings: state.tableSettings,
  playerData: state.playerData,
})

export default connect(
  mapStateToProps,
  { startLoad, stopLoad }
)(ChartComparison)
