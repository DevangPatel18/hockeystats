import React from 'react'
import {
  VictoryChart,
  VictoryStack,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
} from 'victory'

const StackedPointsChart = ({ theme, goals, assists }) => {
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

export default StackedPointsChart
