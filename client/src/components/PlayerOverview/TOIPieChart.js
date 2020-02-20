import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory'
import { Slider } from '@material-ui/core'

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
    pointData: {},
    totalTOI: {},
    marks: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let pointData = {}
    let totalTOI = {}

    let tempYear = ''
    playerStats.forEach(obj => {
      const {
        timeOnIce,
        powerPlayTimeOnIce,
        evenTimeOnIce,
        shortHandedTimeOnIce,
      } = obj.stat

      const TOIsec = stringToSeconds(timeOnIce)
      const ppTOIsec = stringToSeconds(powerPlayTimeOnIce)
      const evTOIsec = stringToSeconds(evenTimeOnIce)
      const shTOIsec = stringToSeconds(shortHandedTimeOnIce)

      if (obj.season === tempYear) {
        totalTOI[obj.season] = totalTOI[obj.season] + TOIsec
        pointData[obj.season] = {
          ppTOI: pointData[obj.season].ppTOI + ppTOIsec,
          evTOI: pointData[obj.season].evTOI + evTOIsec,
          shTOI: pointData[obj.season].shTOI + shTOIsec,
        }
      } else {
        totalTOI[obj.season] = TOIsec
        pointData[obj.season] = {
          ppTOI: ppTOIsec,
          evTOI: evTOIsec,
          shTOI: shTOIsec,
        }
        tempYear = obj.season
      }
    })

    for (let seasonID in pointData) {
      let seasonObj = pointData[seasonID]
      const { ppTOI, evTOI, shTOI } = seasonObj
      totalTOI[seasonID] = secondsToString(totalTOI[seasonID])
      pointData[seasonID] = [
        { x: 'PP', y: ppTOI },
        { x: 'EV', y: evTOI },
        { x: 'SH', y: shTOI },
      ]
    }

    const seasonIDs = Object.keys(pointData)
    const numOfSeasons = seasonIDs.length
    const marks = seasonIDs.map((_, i) => ({
      value: Math.floor((i / (numOfSeasons - 1)) * 100),
      label: '',
    }))
    marks[0].label = seasonIDs[0]
    marks[numOfSeasons - 1].label = seasonIDs[numOfSeasons - 1]

    this.setState({
      totalTOI,
      pointData,
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
    const { totalTOI, pointData, marks, year } = this.state
    if (Object.values(pointData).length === 0) return ''
    return (
      <div style={{ width: '500px' }}>
        <svg viewBox={`0 0 ${SVGSIZE} ${SVGSIZE}`}>
          <VictoryPie
            standalone={false}
            colorScale={colorScheme}
            width={SVGSIZE}
            height={SVGSIZE}
            data={pointData[year]}
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
