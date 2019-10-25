// Dataset Colors
const colors = [
  '#252525',
  '#525252',
  '#737373',
  '#969696',
  '#bdbdbd',
  '#d9d9d9',
  '#f0f0f0',
]

const blueGrey50 = '#ECEFF1'
const blueGrey300 = '#90A4AE'
const blueGrey700 = '#455A64'
const grey900 = '#212121'

// Typography
const sansSerif = "'Roboto', 'Helvetica Neue', Helvetica, sans-serif"
const letterSpacing = 'normal'
const fontSize = 12

// Layout
const padding = 8
let baseProps = {
  width: 450,
  height: 350,
  padding: 50,
}

// * Labels
const baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize,
  letterSpacing,
  padding,
  fill: blueGrey700,
  stroke: 'transparent',
  strokeWidth: 0,
}

const centeredLabelStyles = Object.assign(
  { textAnchor: 'middle' },
  baseLabelStyles
)

// Strokes
const strokeDasharray = '10, 5'
const strokeLinecap = 'round'
const strokeLinejoin = 'round'

// Put it all together...
const chartTheme = (toi = false, width = 450, height = 350) => {
  baseProps = {
    width,
    height,
    padding: toi
      ? { left: 80, top: 25, right: 50, bottom: 50 }
      : { left: 50, top: 25, right: 50, bottom: 50 },
  }
  return {
    area: Object.assign(
      {
        style: {
          data: {
            fill: grey900,
          },
          labels: centeredLabelStyles,
        },
      },
      baseProps
    ),
    axis: Object.assign(
      {
        style: {
          axis: {
            fill: 'transparent',
            stroke: blueGrey300,
            strokeWidth: 2,
            strokeLinecap,
            strokeLinejoin,
          },
          axisLabel: Object.assign({}, centeredLabelStyles, {
            padding,
            stroke: 'transparent',
          }),
          grid: {
            fill: 'none',
            stroke: blueGrey50,
            strokeDasharray,
            strokeLinecap,
            strokeLinejoin,
            pointerEvents: 'painted',
          },
          ticks: {
            fill: 'transparent',
            size: 5,
            stroke: blueGrey300,
            strokeWidth: 1,
            strokeLinecap,
            strokeLinejoin,
          },
          tickLabels: Object.assign({}, baseLabelStyles, {
            fill: blueGrey700,
          }),
        },
      },
      baseProps
    ),
    bar: Object.assign(
      {
        style: {
          data: {
            fill: blueGrey700,
            padding,
            strokeWidth: 0,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    boxplot: Object.assign(
      {
        style: {
          max: {
            padding,
            stroke: blueGrey700,
            strokeWidth: 1,
          },
          maxLabels: baseLabelStyles,
          median: {
            padding,
            stroke: blueGrey700,
            strokeWidth: 1,
          },
          medianLabels: baseLabelStyles,
          min: {
            padding,
            stroke: blueGrey700,
            strokeWidth: 1,
          },
          minLabels: baseLabelStyles,
          q1: {
            padding,
            fill: blueGrey700,
          },
          q1Labels: baseLabelStyles,
          q3: {
            padding,
            fill: blueGrey700,
          },
          q3Labels: baseLabelStyles,
        },
        boxWidth: 20,
      },
      baseProps
    ),
    candlestick: Object.assign(
      {
        style: {
          data: {
            stroke: blueGrey700,
          },
          labels: centeredLabelStyles,
        },
        candleColors: {
          positive: '#ffffff',
          negative: blueGrey700,
        },
      },
      baseProps
    ),
    chart: baseProps,
    errorbar: Object.assign(
      {
        borderWidth: 8,
        style: {
          data: {
            fill: 'transparent',
            opacity: 1,
            stroke: blueGrey700,
            strokeWidth: 2,
          },
          labels: centeredLabelStyles,
        },
      },
      baseProps
    ),
    group: Object.assign(
      {
        colorScale: colors,
      },
      baseProps
    ),
    legend: {
      colorScale: colors,
      gutter: 10,
      orientation: 'vertical',
      titleOrientation: 'top',
      style: {
        data: {
          type: 'circle',
        },
        labels: baseLabelStyles,
        title: Object.assign({}, baseLabelStyles, { padding: 5 }),
      },
      padding: 100,
    },
    line: Object.assign(
      {
        style: {
          data: {
            fill: 'transparent',
            opacity: 1,
            stroke: blueGrey700,
            strokeWidth: 2,
          },
          labels: centeredLabelStyles,
        },
      },
      baseProps
    ),
    pie: Object.assign(
      {
        colorScale: colors,
        style: {
          data: {
            padding,
            stroke: blueGrey50,
            strokeWidth: 1,
          },
          labels: Object.assign({}, baseLabelStyles, { padding: 20 }),
        },
      },
      baseProps
    ),
    scatter: Object.assign(
      {
        style: {
          data: {
            fill: blueGrey700,
            opacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
          },
          labels: centeredLabelStyles,
        },
      },
      baseProps
    ),
    stack: Object.assign(
      {
        colorScale: colors,
      },
      baseProps
    ),
    tooltip: {
      style: Object.assign({}, centeredLabelStyles, {
        padding: 5,
        pointerEvents: 'none',
      }),
      flyoutStyle: {
        stroke: grey900,
        strokeWidth: 1,
        fill: '#f0f0f0',
        pointerEvents: 'none',
      },
      cornerRadius: 5,
      pointerLength: 10,
    },
    voronoi: Object.assign(
      {
        style: {
          data: {
            fill: 'transparent',
            stroke: 'transparent',
            strokeWidth: 0,
          },
          labels: Object.assign({}, centeredLabelStyles, {
            padding: 5,
            pointerEvents: 'none',
          }),
          flyout: {
            stroke: grey900,
            strokeWidth: 1,
            fill: '#f0f0f0',
            pointerEvents: 'none',
          },
        },
      },
      baseProps
    ),
  }
}

export default chartTheme
