import React, { Component } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPlayerList } from '../actions/statActions'

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {}

    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true

    if (!this.props.auth.isAuthenticated) {
      window.addEventListener(
        'beforeunload',
        this.playersToLocalStorage.bind(this)
      )
    }
  }

  componentWillUnmount() {
    this._isMounted = false

    if (!this.props.auth.isAuthenticated && !this.props.auth.loading) {
      window.removeEventListener(
        'beforeunload',
        this.playersToLocalStorage.bind(this)
      )
      this.playersToLocalStorage()
    }
  }

  playersToLocalStorage() {
    const { trackedPlayers } = this.props.stats
    localStorage.setItem('players', JSON.stringify(trackedPlayers))
  }

  render() {
    const { trackedPlayers } = this.props.stats

    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Dashboard</h1>
        {trackedPlayers.length > 0 ? (
          trackedPlayers.map(playerId => <div key={playerId}>{playerId}</div>)
        ) : (
          <div>No players selected for tracking.</div>
        )}
        <br />
        <div>
          <Link to="/app/playerstats">
            <span>Player Statistics</span>
          </Link>
        </div>
        <div>
          <Link to="/">
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  getPlayerList: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  stats: state.stats,
})

export default connect(
  mapStateToProps,
  { getPlayerList }
)(Dashboard)
