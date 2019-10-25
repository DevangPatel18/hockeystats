import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel } from 'victory'
import chartTheme from '../../../helper/chartTheme'
import { secToString } from '../../../helper/columnLabels'
import chroma from 'chroma-js'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

class StatsChart extends Component {
  state = {
    chartWidth: 0,
    chartHeight: 0,
  }

  componentDidMount() {
    this.handleChartResize()
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
      toi,
      sameSeason,
      dataSet,
      statLabel,
      playerData,
      activeLines,
      hover,
    } = this.props

    const { chartWidth, chartHeight } = this.state
    const theme = chartTheme(toi, chartWidth, chartHeight)

    return (
      <VictoryChart
        theme={theme}
        scale={{ x: sameSeason ? 'time' : 'linear' }}
        domainPadding={{ y: 5 }}
        events={[
          {
            childName: 'all',
            target: 'data',
            eventHandlers: {
              onMouseOver: () => [
                {
                  childName: 'all',
                  mutation: props => ({
                    style: { ...props.style, opacity: 0.2 },
                  }),
                },
                {
                  mutation: props => ({
                    style: { ...props.style, opacity: 1 },
                  }),
                },
              ],
              onMouseOut: () => [{ childName: 'all', mutation: () => null }],
            },
          },
        ]}
      >
        {dataSet.map((data, i) => (
          <VictoryLine
            key={`${playerData[i].tag}-line`}
            name={`${playerData[i].tag}-line-name`}
            data={data}
            animate={{ duration: 100 }}
            interpolation="stepAfter"
            style={{
              data: {
                display: activeLines.includes(playerData[i].tag)
                  ? 'inline'
                  : 'none',
                stroke: colorFunc(i / playerData.length),
                transition: '0.2s',
                opacity: hover && hover !== playerData[i].tag ? '0.2' : '1',
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
          y={chartHeight / 2 - 25}
        />
        <VictoryLabel
          text={sameSeason ? 'Date' : 'Games'}
          textAnchor="middle"
          style={{ fontWeight: 'bolder' }}
          x={chartWidth / 2}
          y={chartHeight - 10}
        />
      </VictoryChart>
    )
  }
}

StatsChart.propTypes = {
  toi: PropTypes.bool.isRequired,
  sameSeason: PropTypes.bool.isRequired,
  lineNames: PropTypes.array,
  statLabel: PropTypes.string.isRequired,
  playerData: PropTypes.array.isRequired,
  activeLines: PropTypes.array.isRequired,
  hover: PropTypes.string,
  dataSet: PropTypes.array.isRequired,
}

export default StatsChart
