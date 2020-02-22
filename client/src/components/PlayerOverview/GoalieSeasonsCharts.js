import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryVoronoiContainer,
  VictoryLegend,
} from 'victory'
import { isMobile } from 'react-device-detect'
import chartTheme from '../../helper/chartTheme'

class GoalieSeasonsCharts extends Component {
  state = {
    chartWidth: window.innerWidth - (window.innerWidth % 100),
    chartHeight: window.innerHeight * 0.6 - ((window.innerHeight * 0.6) % 100),
    wins: [],
    losses: [],
    evSavePct: [],
    ppSavePct: [],
    shSavePct: [],
    ovSavePct: [],
  }

  componentDidMount() {
    const { stats } = this.props
    const playerStats = stats.playerObj.stats[0].splits.filter(
      obj => obj.league.id === 133
    )

    const goalieStats = {}
    const newAttributes = [
      'evenShots',
      'evenSaves',
      'powerPlayShots',
      'powerPlaySaves',
      'shortHandedShots',
      'shortHandedSaves',
      'shotsAgainst',
      'saves',
    ]
    const attributes = ['wins', 'losses', ...newAttributes]
    attributes.forEach(attribute => {
      goalieStats[attribute] = []
    })

    let tempYear = ''
    playerStats.forEach(obj => {
      if (obj.season === tempYear) {
        attributes.forEach(attribute => {
          if (!newAttributes.includes(attribute) || obj.season >= 19971998)
            goalieStats[attribute][goalieStats[attribute].length - 1].y +=
              obj.stat[attribute]
        })
      } else {
        attributes.forEach(attribute => {
          if (!newAttributes.includes(attribute) || obj.season >= 19971998)
            goalieStats[attribute].push({
              x: obj.season,
              y: obj.stat[attribute] || 0,
            })
        })
        tempYear = obj.season
      }
    })

    goalieStats.evSavePct = goalieStats.evenShots.map(({ x, y }, idx) => ({
      x,
      y: y < 1 ? 0 : goalieStats.evenSaves[idx].y / y,
    }))

    goalieStats.ppSavePct = goalieStats.powerPlayShots.map(({ x, y }, idx) => ({
      x,
      y: y < 1 ? 0 : goalieStats.powerPlaySaves[idx].y / y,
    }))

    goalieStats.shSavePct = goalieStats.shortHandedShots.map(
      ({ x, y }, idx) => ({
        x,
        y: y < 1 ? 0 : goalieStats.shortHandedSaves[idx].y / y,
      })
    )

    goalieStats.ovSavePct = goalieStats.shotsAgainst.map(({ x, y }, idx) => ({
      x,
      y: y < 1 ? 0 : goalieStats.saves[idx].y / y,
    }))

    this.setState({ ...goalieStats })

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
    const {
      chartWidth,
      chartHeight,
      wins,
      losses,
      evSavePct,
      ppSavePct,
      shSavePct,
      ovSavePct,
    } = this.state
    const theme = chartTheme(false, chartWidth, chartHeight)

    if (wins.length < 1) return ''
    return (
      <div style={{ padding: '0 1rem' }}>
        <VictoryChart
          theme={theme}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ childName, _y }) => `${childName}: ${_y}`}
            />
          }
        >
          <VictoryLegend
            x={isMobile ? chartWidth - 170 : chartWidth - 150}
            y={isMobile ? 0 : 30}
            orientation={isMobile ? 'horizontal' : 'vertical'}
            gutter={20}
            colorScale={'qualitative'}
            data={[{ name: 'Wins' }, { name: 'Losses' }]}
            style={{ labels: { fontSize: isMobile ? 10 : 12 } }}
          />
          <VictoryGroup offset={20} colorScale={'qualitative'}>
            <VictoryBar data={wins} name="wins" />
            <VictoryBar data={losses} name="losses" />
          </VictoryGroup>
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
            text={'Games'}
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

        {[...evSavePct, ...ppSavePct, ...shSavePct].length > 1 && (
          <VictoryChart
            theme={theme}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={({ childName, _y }) =>
                  `${childName.substring(0, 2)}: ${_y.toFixed(3)}`
                }
              />
            }
          >
            <VictoryLegend
              x={isMobile ? chartWidth - 380 : chartWidth - 160}
              y={isMobile ? 0 : 30}
              orientation={isMobile ? 'horizontal' : 'vertical'}
              gutter={20}
              data={[
                { name: 'Overall' },
                { name: 'Evenstrength', symbol: { fill: 'orange' } },
                { name: 'Powerplay', symbol: { fill: 'red' } },
                { name: 'Shorthanded', symbol: { fill: 'blue' } },
              ]}
              style={{ labels: { fontSize: isMobile ? 10 : 12 } }}
            />
            <VictoryLine data={ovSavePct} name="ovSavePct" />
            <VictoryLine
              data={evSavePct}
              style={{ data: { stroke: 'orange' } }}
              name="evSavePct"
            />
            <VictoryLine
              data={ppSavePct}
              style={{ data: { stroke: 'red' } }}
              name="ppSavePct"
            />
            <VictoryLine
              data={shSavePct}
              style={{ data: { stroke: 'blue' } }}
              name="shSavePct"
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
              text={'Percentage'}
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

GoalieSeasonsCharts.propTypes = {
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(mapStateToProps)(GoalieSeasonsCharts)
