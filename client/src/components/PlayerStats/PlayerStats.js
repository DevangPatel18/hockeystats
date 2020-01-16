import React, { Component } from 'react'
import { Link } from 'gatsby'
import { Dialog, Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import configure from '../../utils/configLocalforage'
import * as statActions from '../../actions/statActions'
import { changeField, changeSort } from '../../actions/tableSettingsActions'
import { submitQuery } from '../../actions/playerDataActions'
import handleTable from './handleTableData'
import StatsFilterPanel from './StatsFilterPanel'
import PlayerComparison from './PlayerComparison/PlayerComparison'
import PlayerTags from './PlayerTags'
import PlayerGameLog from '../PlayerGameLog/PlayerGameLog'
import { fetchData, getFilteredStats } from './PlayerStatsHelpers'
import { TransitionUp } from '../../helper/transitions'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

class PlayerStats extends Component {
  constructor() {
    super()
    this.state = {
      trackedPlayers: [],
      selectedPlayers: [],
      modal: false,
    }

    this.handleTable = handleTable.bind(this)

    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.handleSubmitQuery()

    if (!this.props.auth.isAuthenticated) {
      window.addEventListener(
        'beforeunload',
        this.playersToLocalStorage.bind(this)
      )
    }
  }

  playersToLocalStorage() {
    const { trackedPlayers } = this.props.stats
    if (typeof window !== 'undefined') {
      localStorage.setItem('players', JSON.stringify(trackedPlayers))
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

  handleRowFilter = name => event => {
    const { stats } = this.props.playerData
    const selectedPlayers = this.state.selectedPlayers.filter(playerStr => {
      const [playerId, seasonId] = playerStr.split('-')
      const playerObj = stats.find(
        obj =>
          obj.playerId === parseInt(playerId) &&
          (!seasonId || obj.seasonId === parseInt(seasonId))
      )
      return event.target.value.includes(playerObj[name])
    })
    this.props.changeField(name, event.target.value)
    this.setState({ selectedPlayers })
  }

  handleChangePage = async (event, page) => {
    await this.props.changeField('page', page)
    this.handleSubmitQuery()
  }

  handleRowClick = ({ currentTarget }) => {
    const playerId = +currentTarget.attributes.playerid.value
    if (currentTarget.attributes.seasonid) {
      const seasonId = +currentTarget.attributes.seasonid.value
      const teams = currentTarget.attributes.teams.value
      const playerSeasonId = this.props.tableSettings.isAggregate
        ? `${playerId}`
        : `${playerId}-${seasonId}-${teams}`
      this.handleSelectedPlayers(playerSeasonId)
    } else {
      this.handleSelectedPlayers(`${playerId}`)
    }
  }

  handleTagClick = ({ currentTarget }) => {
    this.handleSelectedPlayers(currentTarget.id)
  }

  handleSelectedPlayers = playerSeasonId => {
    const newSelectedPlayers = this.state.selectedPlayers.slice()
    const selectedIndex = newSelectedPlayers.indexOf(playerSeasonId)

    if (selectedIndex === -1) {
      newSelectedPlayers.push(playerSeasonId)
    } else {
      newSelectedPlayers.splice(selectedIndex, 1)
    }
    this.setState({ selectedPlayers: newSelectedPlayers })
  }

  handleChangeRowsPerPage = async event => {
    await this.props.changeField('rowsPerPage', parseInt(event.target.value))
    this.handleSubmitQuery()
  }

  handleRequestSort = async ({ currentTarget }) => {
    if (['track', 'gameLogs'].includes(currentTarget.id)) return
    const { order, orderBy } = this.props.tableSettings
    const newOrderBy = currentTarget.id
    let newOrder = 'desc'

    if (newOrderBy === orderBy && order === 'desc') {
      newOrder = 'asc'
    }

    await this.props.changeSort(newOrder, newOrderBy)
    this.handleSubmitQuery()
  }

  handleModalOpen = () => {
    this.setState({ modal: true })
  }

  handleModalClose = () => {
    this.setState({ modal: false })
  }

  handleSubmitQuery = async () => {
    this.props.startLoad()
    const stats = await configure().then(api => fetchData(api))
    this.props.stopLoad()
    if (!stats) return

    if (stats && this._isMounted) {
      this.props.submitQuery(stats)
      this.setState({ selectedPlayers: [] })
    }
  }

  updateTrackedPlayers = event => {
    const playerId = +event.target.attributes.playerid.value
    const seasonId = +event.target.attributes.seasonid.value
    const { trackedPlayers } = this.props.stats
    const index = trackedPlayers.findIndex(
      obj => obj.playerId === playerId && obj.seasonId === seasonId
    )

    const dispatchArgs = {
      userId: this.props.auth.user.id,
      playerId,
      seasonId,
    }

    if (index === -1) {
      this.props.addPlayerList(dispatchArgs)
    } else {
      this.props.removePlayerList(dispatchArgs)
    }
  }

  handleStarClick = (playerId, seasonId) =>
    this.props.stats.trackedPlayers.some(
      obj => obj.playerId === playerId && obj.seasonId === seasonId
    )

  render() {
    const { selectedPlayers } = this.state
    const { gameLogModal } = this.props.stats
    const { stats } = this.props.playerData
    const dataDisplay = getFilteredStats(stats)

    return (
      <div>
        <h1>Player Statistics</h1>
        <StatsFilterPanel
          handleRowFilter={this.handleRowFilter}
          handleSubmitQuery={this.handleSubmitQuery}
          handleModalOpen={this.handleModalOpen}
        />
        <PlayerTags
          selectedPlayers={selectedPlayers}
          stats={dataDisplay}
          handleTagClick={this.handleTagClick}
        />
        {this.handleTable(dataDisplay)}
        <br />
        <Button
          component={Link}
          to="/app/dashboard"
          color="secondary"
          variant="contained"
          size="large"
        >
          Dashboard
        </Button>
        <Dialog
          fullScreen
          open={this.state.modal}
          scroll="paper"
          TransitionComponent={TransitionUp}
        >
          <PlayerComparison
            onClose={this.handleModalClose}
            selectedPlayers={selectedPlayers}
            data={dataDisplay}
          />
        </Dialog>
        <Dialog
          fullScreen
          open={gameLogModal}
          scroll="paper"
          TransitionComponent={TransitionUp}
        >
          <PlayerGameLog />
        </Dialog>
      </div>
    )
  }
}

PlayerStats.propTypes = {
  getPlayerList: PropTypes.func.isRequired,
  addPlayerList: PropTypes.func.isRequired,
  removePlayerList: PropTypes.func.isRequired,
  startLoad: PropTypes.func.isRequired,
  stopLoad: PropTypes.func.isRequired,
  changeField: PropTypes.func.isRequired,
  changeSort: PropTypes.func.isRequired,
  submitQuery: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  stats: state.stats,
  tableSettings: state.tableSettings,
  playerData: state.playerData,
})

export default connect(
  mapStateToProps,
  {
    getPlayerList: statActions.getPlayerList,
    addPlayerList: statActions.addPlayerList,
    removePlayerList: statActions.removePlayerList,
    startLoad: statActions.startLoad,
    stopLoad: statActions.stopLoad,
    changeField,
    changeSort,
    submitQuery,
  }
)(PlayerStats)
