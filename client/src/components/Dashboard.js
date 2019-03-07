import React, { Component } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPlayerList } from '../actions/statActions'
import configure from '../utils/configLocalforage'
import DashboardProfiles from './DashboardProfiles'

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      trackedPlayerData: [],
    }

    this._isMounted = false
  }

  async componentDidMount() {
    const { trackedPlayers } = this.props.stats
    this._isMounted = true

    if (trackedPlayers.length) {
      await configure().then(async api => {
        const trackedPlayerData = await Promise.all(
          trackedPlayers.map(playerId =>
            api.get(`/api/statistics/players/${playerId}`).then(res => res.data)
          )
        )
        if (this._isMounted) {
          this.setState({ trackedPlayerData })
        }
      })
    }

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
    const { trackedPlayerData } = this.state
    const { trackedPlayers } = this.props.stats

    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Dashboard</h1>
        <br />
        {trackedPlayers.length ? (
          <DashboardProfiles trackedPlayerData={trackedPlayerData} />
        ) : (
          <div>No players selected for tracking.</div>
        )}
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
