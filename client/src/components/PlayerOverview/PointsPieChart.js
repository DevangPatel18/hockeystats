import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory'
import { Slider } from '@material-ui/core'

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
    pointData: {},
    marks: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let pointData = {}

    let tempYear = ''
    playerStats.forEach(obj => {
      const {
        powerPlayPoints,
        powerPlayGoals,
        shortHandedPoints,
        shortHandedGoals,
        assists,
        goals,
      } = obj.stat
      const ppAssists = powerPlayPoints - powerPlayGoals
      const shAssists = shortHandedPoints - shortHandedGoals
      const evAssists = assists - ppAssists - shAssists
      const evGoals = goals - powerPlayGoals - shortHandedGoals

      if (obj.season === tempYear) {
        pointData[obj.season] = {
          evGoals: pointData[obj.season].evGoals + evGoals,
          evAssists: pointData[obj.season].evAssists + evAssists,
          ppGoals: pointData[obj.season].ppGoals + powerPlayGoals,
          ppAssists: pointData[obj.season].ppAssists + ppAssists,
          shGoals: pointData[obj.season].shGoals + shortHandedGoals,
          shAssists: pointData[obj.season].shAssists + shAssists,
        }
      } else {
        pointData[obj.season] = {
          evGoals,
          ppGoals: powerPlayGoals,
          shGoals: shortHandedGoals,
          evAssists,
          ppAssists,
          shAssists,
        }
        tempYear = obj.season
      }
    })

    for (let seasonID in pointData) {
      let seasonObj = pointData[seasonID]
      pointData[seasonID] = [
        { x: `EVG: ${seasonObj.evGoals}`, y: seasonObj.evGoals },
        { x: `PPG: ${seasonObj.ppGoals}`, y: seasonObj.ppGoals },
        { x: `SHG: ${seasonObj.shGoals}`, y: seasonObj.shGoals },
        { x: `EVA: ${seasonObj.evAssists}`, y: seasonObj.evAssists },
        { x: `PPA: ${seasonObj.ppAssists}`, y: seasonObj.ppAssists },
        { x: `SHA: ${seasonObj.shAssists}`, y: seasonObj.shAssists },
      ]
    }

    const seasonIDs = Object.keys(pointData)
    const numOfSeasons = seasonIDs.length
    const marks = seasonIDs.map((seasonID, i) => ({
      value: Math.floor((i / (numOfSeasons - 1)) * 100),
      label: '',
    }))
    marks[0].label = seasonIDs[0]
    marks[numOfSeasons - 1].label = seasonIDs[numOfSeasons - 1]

    this.setState({
      pointData,
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
    const { pointData, marks, year } = this.state
    const size = 400
    if (Object.values(pointData).length === 0) return ''
    const pointTotal = pointData[year].reduce((a, b) => a + b.y, 0)
    return (
      <div style={{ width: '500px' }}>
        <svg viewBox={`0 0 ${size} ${size}`}>
          <VictoryPie
            standalone={false}
            colorScale={colorScheme}
            width={size}
            height={size}
            data={pointData[year]}
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
