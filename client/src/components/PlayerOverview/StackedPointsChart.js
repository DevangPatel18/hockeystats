import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
} from 'victory'
import chartTheme from '../../helper/chartTheme'

class StackedPointsChart extends Component {
  state = {
    chartWidth: window.innerWidth - (window.innerWidth % 100),
    chartHeight: window.innerHeight * 0.6 - ((window.innerHeight * 0.6) % 100),
    goals: [],
    assists: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let assists = []
    let goals = []

    let tempYear = ''
    playerStats.forEach(obj => {
      if (obj.season === tempYear) {
        assists[assists.length - 1].y += obj.stat.assists
        goals[goals.length - 1].y += obj.stat.goals
      } else {
        assists.push({ x: obj.season, y: obj.stat.assists })
        goals.push({ x: obj.season, y: obj.stat.goals })
        tempYear = obj.season
      }
    })

    this.setState({ assists, goals })

    window.addEventListener('resize', this.handleChartResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleChartResize)
  }

  handleChartResize = () => {
    const { chartWidth, chartHeight } = this.state
    const newWidth = window.innerWidth - (window.innerWidth % 100)
    const newHeight =
      window.innerHeight * 0.6 - ((window.innerHeight * 0.6) % 100)
    if (newWidth !== chartWidth || newHeight !== chartHeight) {
      this.setState({
        chartWidth: newWidth,
        chartHeight: newHeight,
      })
    }
  }

  render() {
    const { chartWidth, chartHeight, goals, assists } = this.state
    const theme = chartTheme(false, chartWidth, chartHeight)

    if (goals.length < 1) return ''
    return (
      <div>
        <VictoryChart
          theme={theme}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ childName, _y }) => `${childName}: ${_y}`}
            />
          }
        >
          <VictoryStack colorScale="warm">
            <VictoryArea data={assists} name="assists" />
            <VictoryArea data={goals} name="goals" />
          </VictoryStack>
          <VictoryAxis
            crossAxis
            style={{
              label: 'Label',
              axisLabel: { padding: 0, angle: 35 },
              tickLabels: { padding: 0, angle: 35 },
            }}
          />
          <VictoryAxis dependentAxis crossAxis />
        </VictoryChart>
      </div>
    )
  }
}

StackedPointsChart.propTypes = {
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(mapStateToProps)(StackedPointsChart)
