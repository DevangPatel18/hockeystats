import React, { Component } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPlayerList } from '../actions/statActions'
import configure from '../utils/configLocalforage'

// Configure 'localforage' and instantiate 'axios' with 'axios-cache-adapter'
configure()

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

    if (trackedPlayers.length) {
      await configure().then(async api => {
        const trackedPlayerData = await Promise.all(
          trackedPlayers.map(playerId =>
            api.get(`/api/statistics/players/${playerId}`).then(res => res.data)
          )
        )
        this.setState({ trackedPlayerData })
      })
    }

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
    const { trackedPlayerData } = this.state
    const { trackedPlayers } = this.props.stats

    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Dashboard</h1>
        <br />
        {trackedPlayers.length ? (
          trackedPlayerData.map(playerObj => (
            <div key={playerObj.id} style={{ marginBottom: '1rem' }}>
              <h4>{playerObj.fullName}</h4>
              <div>
                Team: {playerObj.currentTeam.name} -{' '}
                {playerObj.primaryPosition.abbreviation} - #{
                  playerObj.primaryNumber
                }
              </div>
              <div>
                Bio: {playerObj.currentAge} yrs - {playerObj.height} ft -{' '}
                {playerObj.weight} lbs
              </div>
              <div>Birthdate: {playerObj.birthDate}</div>
              <div>
                Birthplace: {playerObj.birthCity},
                {playerObj.birthStateProvince &&
                  ` ${playerObj.birthStateProvince}, `}{' '}
                {playerObj.birthCountry}
              </div>
            </div>
          ))
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
