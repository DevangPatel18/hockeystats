import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  TablePagination,
  Paper,
  Dialog,
  LinearProgress,
  Slide,
  Button,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import configure from '../../utils/configLocalforage'
import {
  getPlayerList,
  addPlayerList,
  removePlayerList,
  startLoad,
  stopLoad,
  closePlayerModal,
} from '../../actions/statActions'
import TablePaginationActions from './TablePaginationActions'
import StatsFilterPanel from './StatsFilterPanel'
import TableData from './TableData'
import PlayerComparison from './PlayerComparison/PlayerComparison'
import PlayerTags from './PlayerTags'
import PlayerGameLog from '../PlayerGameLog'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

function Transition(props) {
  return <Slide direction="up" {...props} />
}

class PlayerStats extends Component {
  constructor() {
    super()
    this.state = {
      stats: [],
      playerPositionCode: 'LRCD',
      dataType: '',
      teamFilter: 'all',
      teams: '',
      countryFilter: 'all',
      countries: '',
      trackedPlayers: [],
      selectedPlayers: [],
      page: 0,
      rowsPerPage: 10,
      modal: false,
      playerLogModal: false,
      playerLogData: {},
    }

    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this.submitQuery()

    if (!this.props.auth.isAuthenticated) {
      window.addEventListener(
        'beforeunload',
        this.playersToLocalStorage.bind(this)
      )
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      playerLogModal: nextProps.stats.modalOpen,
      playerLogData: nextProps.stats.playerObj,
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleRowFilter = name => event => {
    const { stats } = this.state
    const selectedPlayers = this.state.selectedPlayers.filter(playerStr => {
      const [playerId, seasonId] = playerStr.split('-')
      const playerObj = stats.find(
        obj =>
          obj.playerId === parseInt(playerId) &&
          (!seasonId || obj.seasonId === parseInt(seasonId))
      )
      return event.target.value.includes(playerObj[name])
    })
    this.setState({ [name]: event.target.value, selectedPlayers })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleRowClick = ({ currentTarget }) => {
    const playerId = +currentTarget.attributes.playerid.value
    const seasonId = +currentTarget.attributes.seasonid.value
    const teams = currentTarget.attributes.teams.value
    const playerSeasonId = this.props.stats.isAggregate
      ? `${playerId}`
      : `${playerId}-${seasonId}-${teams}`
    this.handleSelectedPlayers(playerSeasonId)
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

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value) })
  }

  handleRequestSort = ({ currentTarget }) => {
    const orderBy = currentTarget.id
    let order = 'desc'

    if (this.state.orderBy === orderBy && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleModalOpen = () => {
    this.setState({ modal: true })
  }

  handleModalClose = () => {
    this.setState({ modal: false })
  }

  submitQuery = e => {
    if (e) {
      e.preventDefault()
    }

    const {
      yearStart,
      yearEnd,
      reportName,
      isAggregate,
      playoffs,
    } = this.props.tableSettings

    this.props.startLoad()
    configure().then(async api => {
      const stats = await api
        .get(
          `/api/statistics/${isAggregate.toString()}/${reportName}/${yearStart}/${yearEnd}/${playoffs}`
        )
        .then(res => res.data)
        .catch(err => {
          console.log(err)
        })

      this.props.stopLoad()

      if (!stats) return

      const teams = !isAggregate
        ? stats
            .reduce((acc, playerObj) => {
              let team = playerObj.playerTeamsPlayedFor
              if (team && team.length === 3 && !acc.includes(team)) {
                acc.push(team)
              }
              return acc
            }, [])
            .sort()
        : ''

      const countries = stats
        .reduce((acc, playerObj) => {
          let country = playerObj.playerBirthCountry
          if (country && !acc.includes(country)) {
            acc.push(country)
          }
          return acc
        }, [])
        .sort()

      if (stats && this._isMounted) {
        this.setState({
          stats,
          teams,
          countries,
          selectedPlayers: [],
          teamFilter: 'all',
          countryFilter: 'all',
          dataType: playoffs ? 'playoffs' : 'regular',
        })
      }
    })
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
    const {
      stats,
      playerPositionCode,
      selectedPlayers,
      rowsPerPage,
      page,
      order,
      orderBy,
      teamFilter,
      countryFilter,
      dataType,
      playerLogModal,
      playerLogData,
      teams,
      countries,
    } = this.state
    const { closePlayerModal } = this.props
    const { dataLoad, trackedPlayers } = this.props.stats
    const { filterTracked, search } = this.props.tableSettings

    const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true
    let dataDisplay = isSkaters
      ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
      : stats
    dataDisplay = filterTracked
      ? dataDisplay.filter(obj =>
          trackedPlayers.some(
            listObj =>
              listObj.playerId === obj.playerId &&
              listObj.seasonId === obj.seasonId
          )
        )
      : dataDisplay
    dataDisplay =
      teamFilter !== 'all'
        ? dataDisplay.filter(
            playerObj =>
              playerObj.playerTeamsPlayedFor &&
              playerObj.playerTeamsPlayedFor.includes(teamFilter)
          )
        : dataDisplay
    dataDisplay = search
      ? dataDisplay.filter(obj => obj.playerName.toLowerCase().includes(search))
      : dataDisplay
    dataDisplay =
      countryFilter !== 'all'
        ? dataDisplay.filter(
            playerObj => playerObj.playerBirthCountry === countryFilter
          )
        : dataDisplay

    const statsFilterPanelProps = {
      playerPositionCode,
      teamFilter,
      teams,
      countryFilter,
      countries,
    }

    return (
      <div>
        <h1>Player Statistics</h1>
        <StatsFilterPanel
          {...statsFilterPanelProps}
          handleChange={this.handleChange}
          handleRowFilter={this.handleRowFilter}
          submitQuery={this.submitQuery}
          handleModalOpen={this.handleModalOpen}
        />
        <PlayerTags
          selectedPlayers={selectedPlayers}
          stats={dataDisplay}
          handleTagClick={this.handleTagClick}
        />
        <LinearProgress
          color="secondary"
          style={{
            opacity: dataLoad ? '1' : '0',
            transition: 'all 0.5s',
            marginBottom: '-3px',
          }}
        />
        <Paper>
          <div
            style={{
              position: 'absolute',
              width: 'calc(100% - 2rem)',
              height: `calc(156px + ${rowsPerPage * 33}px)`,
              background: 'white',
              opacity: dataLoad ? '0.5' : '0',
              zIndex: dataLoad ? '1' : '-1',
              transition: 'all 0.5s',
            }}
          />
          <TableData
            dataDisplay={dataDisplay}
            page={page}
            order={order}
            orderBy={orderBy}
            rowsPerPage={rowsPerPage}
            selectedPlayers={selectedPlayers}
            handleRowClick={this.handleRowClick}
            updateTrackedPlayers={this.updateTrackedPlayers}
            handleRequestSort={this.handleRequestSort}
            handleStarClick={this.handleStarClick}
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={dataDisplay.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              native: true,
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            style={{ overflow: 'auto' }}
          />
        </Paper>
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
          TransitionComponent={Transition}
        >
          <PlayerComparison
            onClose={this.handleModalClose}
            selectedPlayers={selectedPlayers}
            data={dataDisplay}
            dataType={dataType}
          />
        </Dialog>
        <Dialog
          fullScreen
          open={playerLogModal}
          scroll="paper"
          TransitionComponent={Transition}
        >
          <PlayerGameLog
            onClose={closePlayerModal}
            playerObj={playerLogData}
            dataType={dataType}
          />
        </Dialog>
      </div>
    )
  }
}

PlayerStats.propTypes = {
  getPlayerList: PropTypes.func.isRequired,
  addPlayerList: PropTypes.func.isRequired,
  removePlayerList: PropTypes.func.isRequired,
  closePlayerModal: PropTypes.func.isRequired,
  startLoad: PropTypes.func.isRequired,
  stopLoad: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  stats: state.stats,
  tableSettings: state.tableSettings,
})

export default connect(
  mapStateToProps,
  {
    getPlayerList,
    addPlayerList,
    removePlayerList,
    startLoad,
    stopLoad,
    closePlayerModal,
  }
)(PlayerStats)
