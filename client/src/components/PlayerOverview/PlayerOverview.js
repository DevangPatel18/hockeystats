import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePlayerModal } from '../../actions/statActions'
import { AppBar, IconButton, Toolbar } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import chartTheme from '../../helper/chartTheme'
import StackedPointsChart from './StackedPointsChart'

class PlayerOverview extends Component {
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
    const { stats, closePlayerModal } = this.props
    const { chartWidth, chartHeight, goals, assists } = this.state
    const theme = chartTheme(false, chartWidth, chartHeight)

    return (
      <div>
        <AppBar position="static">
          <Toolbar style={{ position: 'relative' }}>
            <IconButton
              color="inherit"
              onClick={() => closePlayerModal('overviewModal')}
              aria-label="Close"
              style={{ position: 'absolute' }}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ margin: '0 auto' }}>{stats.playerObj.fullName}</div>
          </Toolbar>
        </AppBar>
        <StackedPointsChart theme={theme} goals={goals} assists={assists} />
      </div>
    )
  }
}

PlayerOverview.propTypes = {
  closePlayerModal: PropTypes.func.isRequired,
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
})

export default connect(
  mapStateToProps,
  { closePlayerModal }
)(PlayerOverview)
