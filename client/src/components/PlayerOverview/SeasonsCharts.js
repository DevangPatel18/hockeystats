import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
  VictoryVoronoiContainer,
} from 'victory'
import chartTheme from '../../helper/chartTheme'

class SeasonsCharts extends Component {
  state = {
    chartWidth: window.innerWidth - (window.innerWidth % 100),
    chartHeight: window.innerHeight * 0.6 - ((window.innerHeight * 0.6) % 100),
    goals: [],
    assists: [],
    plusMinus: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    let assists = []
    let goals = []
    let plusMinus = []

    let tempYear = ''
    playerStats.forEach(obj => {
      if (obj.season === tempYear) {
        assists[assists.length - 1].y += obj.stat.assists
        goals[goals.length - 1].y += obj.stat.goals
        plusMinus[plusMinus.length - 1].y += obj.stat.plusMinus
      } else {
        assists.push({ x: obj.season, y: obj.stat.assists })
        goals.push({ x: obj.season, y: obj.stat.goals })
        plusMinus.push({ x: obj.season, y: obj.stat.plusMinus })
        tempYear = obj.season
      }
    })

    this.setState({ assists, goals, plusMinus })

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
    const { chartWidth, chartHeight, goals, assists, plusMinus } = this.state
    const theme = chartTheme(false, chartWidth, chartHeight)

    if (goals.length < 1) return ''
    return (
      <div style={{ padding: '0 1rem' }}>
        {goals.length > 0 && (
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
            <VictoryLabel
              angle="-90"
              text={'Points'}
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={10}
              y={chartHeight / 2 - 25}
            />
            <VictoryLabel
              text={'Season'}
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={chartWidth / 2}
              y={chartHeight - 10}
            />
          </VictoryChart>
        )}

        {plusMinus.length > 0 && (
          <VictoryChart theme={theme}>
            <VictoryBar
              data={plusMinus}
              style={{
                data: { fill: 'lightblue' },
                labels: {
                  fontWeight: 'bolder',
                },
              }}
              labels={({ y }) => y}
            />
            <VictoryAxis
              crossAxis
              style={{
                label: 'Label',
                axisLabel: { padding: 0, angle: 35 },
                tickLabels: { padding: 0, angle: 35 },
              }}
            />
            <VictoryAxis dependentAxis crossAxis />
            <VictoryLabel
              angle="-90"
              text={'Plus/Minus'}
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={10}
              y={chartHeight / 2 - 25}
            />
            <VictoryLabel
              text={'Season'}
              textAnchor="middle"
              style={{ fontWeight: 'bolder' }}
              x={chartWidth / 2}
              y={chartHeight - 10}
            />
          </VictoryChart>
        )}
      </div>
    )
  }
}

SeasonsCharts.propTypes = {
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(mapStateToProps)(SeasonsCharts)
