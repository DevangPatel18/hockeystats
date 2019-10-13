import React, { Component } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import configure from '../../utils/configLocalforage'
import DashboardProfiles from './DashboardProfiles'
import { CircularProgress, Button, Dialog, Slide } from '@material-ui/core/'
import { closePlayerModal } from '../../actions/statActions'
import PlayerGameLog from '../PlayerGameLog'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      trackedPlayerData: [],
    }

    this._isMounted = false
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      modalOpen: nextProps.stats.modalOpen,
      playerObj: nextProps.stats.playerObj,
    }
  }

  async componentDidMount() {
    const { trackedPlayers } = this.props.stats
    this._isMounted = true

    if (trackedPlayers.length) {
      await configure().then(async api => {
        const trackedPlayerData = await Promise.all(
          trackedPlayers.map(obj =>
            api
              .get(`/api/statistics/players/${obj.playerId}`)
              .then(res => ({ ...res.data, seasonId: obj.seasonId }))
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('players', JSON.stringify(trackedPlayers))
    }
  }

  render() {
    const { trackedPlayerData } = this.state
    const { closePlayerModal, stats } = this.props
    const { trackedPlayers, modalOpen, playerObj } = stats
    const filterTrackedPlayerData = trackedPlayerData.filter(dataObj =>
      trackedPlayers.some(
        listObj =>
          listObj.playerId === dataObj.id &&
          listObj.seasonId === dataObj.seasonId
      )
    )

    return (
      <div>
        <h1>Dashboard</h1>
        <br />
        {trackedPlayers.length ? (
          filterTrackedPlayerData.length ? (
            <DashboardProfiles trackedPlayerData={filterTrackedPlayerData} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress />
            </div>
          )
        ) : (
          <div>No players selected for tracking.</div>
        )}
        <div>
          <Button
            component={Link}
            to="/app/playerstats"
            color="secondary"
            variant="contained"
            size="large"
            style={{ marginTop: '1rem' }}
          >
            Player Statistics
          </Button>
        </div>
        <Dialog
          fullScreen
          open={modalOpen}
          scroll="paper"
          TransitionComponent={Transition}
        >
          <PlayerGameLog
            onClose={closePlayerModal}
            playerObj={playerObj}
            dataType="regular"
          />
        </Dialog>
      </div>
    )
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
  closePlayerModal: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  stats: state.stats,
})

export default connect(
  mapStateToProps,
  { closePlayerModal }
)(Dashboard)
