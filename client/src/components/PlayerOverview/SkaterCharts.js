import React from 'react'
import SeasonsCharts from './SeasonsCharts'
import PointsPieChart from './PointsPieChart'
import TOIPieChart from './TOIPieChart'

const SkaterCharts = () => {
  return (
    <>
      <SeasonsCharts />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <PointsPieChart />
        <TOIPieChart />
      </div>
    </>
  )
}

export default SkaterCharts
