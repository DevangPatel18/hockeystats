import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory'
import { Slider } from '@material-ui/core'

const statKeys = ['EVG', 'EVA', 'PPG', 'PPA', 'SHG', 'SHA']

const colorScheme = [
  '#324666',
  '#4E6487',
  '#8392AB',
  '#7CA6B5',
  '#A8C4CD',
  '#D3E1E6',
]

const formatYear = year => {
  const yearText = [...year]
  yearText.splice(4, 0, '-')
  return yearText
}

class PointsPieChart extends Component {
  state = {
    seasonID: '',
    chartData: {},
    marks: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let chartData = {}
    let data = {}
    let year = ''

    playerStats.forEach(({ stat, season }) => {
      data.PPA = stat.powerPlayPoints - stat.powerPlayGoals
      data.SHA = stat.shortHandedPoints - stat.shortHandedGoals
      data.EVA = stat.assists - data.PPA - data.SHA
      data.EVG = stat.goals - stat.powerPlayGoals - stat.shortHandedGoals
      data.PPG = stat.powerPlayGoals
      data.SHG = stat.shortHandedGoals

      if (season === year) {
        statKeys.forEach(stat => {
          chartData[season] = {
            [stat]: chartData[season][stat] + data[stat],
            ...chartData[season],
          }
        })
      } else {
        statKeys.forEach(stat => {
          chartData[season] = { [stat]: data[stat], ...chartData[season] }
        })
        year = season
      }
    })

    for (let seasonID in chartData) {
      let seasonObj = chartData[seasonID]
      chartData[seasonID] = statKeys.map(stat => ({
        x: `${stat}: ${seasonObj[stat]}`,
        y: seasonObj[stat],
      }))
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
      chartData,
      marks,
      seasonIDs,
      year: seasonIDs[numOfSeasons - 1],
    })
  }

  handleSlider = (event, index) => {
    const { seasonIDs } = this.state
    const year = seasonIDs[Math.ceil((index / 100) * (seasonIDs.length - 1))]
    this.setState({ year })
  }

  render() {
    const { chartData, marks, year } = this.state
    const size = 400
    if (Object.values(chartData).length === 0) return ''
    const pointTotal = chartData[year].reduce((a, b) => a + b.y, 0)
    return (
      <div style={{ width: '500px' }}>
        <svg viewBox={`0 0 ${size} ${size}`}>
          <VictoryPie
            standalone={false}
            colorScale={colorScheme}
            width={size}
            height={size}
            data={chartData[year]}
            labelPosition="centroid"
            style={{ labels: { fontSize: 12, padding: 8 } }}
            animate={{ duration: 200 }}
            innerRadius={size / 7}
          />
          <text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle">
            {formatYear(year)}
          </text>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            {pointTotal}
          </text>
          <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle">
            points
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

PointsPieChart.propTypes = {
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(mapStateToProps)(PointsPieChart)
