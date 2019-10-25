import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel } from 'victory'
import chartTheme from '../../../helper/chartTheme'
import { secToString } from '../../../helper/columnLabels'
import chroma from 'chroma-js'

const colorFunc = chroma.cubehelix().lightness([0.3, 0.7])

class StatsChart extends Component {
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

    const theme = chartTheme(toi)

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
          y={150}
        />
        <VictoryLabel
          text={sameSeason ? 'Date' : 'Games'}
          textAnchor="middle"
          style={{ fontWeight: 'bolder' }}
          x={225}
          y={340}
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
