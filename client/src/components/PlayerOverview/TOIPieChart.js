import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory'
import { Slider } from '@material-ui/core'

const statKeys = ['EV', 'PP', 'SH']

const colorScheme = ['#324666', '#8392AB', '#A8C4CD']

const SVGSIZE = 400

const formatYear = year => {
  const yearText = [...year]
  yearText.splice(4, 0, '-')
  return yearText
}

const stringToSeconds = (string = '0:0') => {
  const [mins, secs] = string.split(':')
  return parseInt(mins) * 60 + parseInt(secs)
}

const secondsToString = (seconds = 0) => {
  const modSecs = seconds % 60
  const min = (seconds - modSecs) / 60
  return `${min < 10 ? '0' : ''}${min}:${modSecs < 10 ? '0' : ''}${modSecs}`
}

class TOIPieChart extends Component {
  state = {
    seasonID: '',
    chartData: {},
    totalTOI: {},
    marks: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let chartData = {}
    let totalTOI = {}
    let tempData = {}
    let year = ''

    playerStats.forEach(({ stat, season }) => {
      const TOIsec = stringToSeconds(stat.timeOnIce)
      tempData.EV = stringToSeconds(stat.evenTimeOnIce)
      tempData.PP = stringToSeconds(stat.powerPlayTimeOnIce)
      tempData.SH = stringToSeconds(stat.shortHandedTimeOnIce)

      if (season === year) {
        totalTOI[season] = totalTOI[season] + TOIsec
        chartData[season] = statKeys.map((stat, idx) => ({
          x: stat,
          y: chartData[season][idx].y + tempData[stat],
        }))
      } else {
        totalTOI[season] = TOIsec
        chartData[season] = statKeys.map(stat => ({
          x: stat,
          y: tempData[stat],
        }))
        year = season
      }
    })

    for (let seasonID in chartData) {
      totalTOI[seasonID] = secondsToString(totalTOI[seasonID])
    }

    const seasonIDs = Object.keys(chartData)
    const numOfSeasons = seasonIDs.length
    const marks = seasonIDs.map((_, i) => ({
      value: Math.floor((i / (numOfSeasons - 1)) * 100),
      label: '',
    }))
    marks[0].label = seasonIDs[0]
    marks[numOfSeasons - 1].label = seasonIDs[numOfSeasons - 1]

    this.setState({
      totalTOI,
      chartData,
      marks,
      seasonIDs,
      year: seasonIDs[numOfSeasons - 1],
    })
  }

  handleSlider = (_, index) => {
    const { seasonIDs } = this.state
    const year = seasonIDs[Math.ceil((index / 100) * (seasonIDs.length - 1))]
    this.setState({ year })
  }

  handleLabel = ({ x, y }) => (y !== 0 ? `${x}: ${secondsToString(y)}` : '')

  render() {
    const { totalTOI, chartData, marks, year } = this.state
    if (Object.values(chartData).length === 0) return ''
    return (
      <div style={{ width: '500px' }}>
        <svg viewBox={`0 0 ${SVGSIZE} ${SVGSIZE}`}>
          <VictoryPie
            standalone={false}
            colorScale={colorScheme}
            width={SVGSIZE}
            height={SVGSIZE}
            data={chartData[year]}
            labelPosition="centroid"
            style={{ labels: { fontSize: 12, padding: 13 } }}
            animate={{ duration: 200 }}
            innerRadius={SVGSIZE / 7}
            labels={this.handleLabel}
          />
          <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle">
            {formatYear(year)}
          </text>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            {totalTOI[year]}
          </text>
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle">
            TOI
          </text>
        </svg>
        <div style={{ width: '60%', margin: '0 auto', textAlign: 'center' }}>
          <Slider
            marks={marks}
            defaultValue={100}
            step={null}
            track={false}
            valueLabelDisplay="off"
            onChangeCommitted={this.handleSlider}
          />
        </div>
      </div>
    )
  }
}

TOIPieChart.propTypes = {
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(mapStateToProps)(TOIPieChart)
