import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { closePlayerModal } from '../../actions/statActions'
import { AppBar, IconButton, Toolbar } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import SeasonsCharts from './SeasonsCharts'
import PointsPieChart from './PointsPieChart'
import TOIPieChart from './TOIPieChart'

class PlayerOverview extends Component {
  render() {
    const { stats, closePlayerModal } = this.props

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
