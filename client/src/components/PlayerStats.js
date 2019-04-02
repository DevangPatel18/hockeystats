import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  Table,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Dialog,
  LinearProgress,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import configure from '../utils/configLocalforage'
import {
  getPlayerList,
  addPlayerList,
  removePlayerList,
  startLoad,
  stopLoad,
} from '../actions/statActions'
import TablePaginationActions from './TablePaginationActions'
import StatsFilterPanel from './StatsFilterPanel'
import TableData from './TableData'
import PlayerComparison from './PlayerComparison'
import PlayerTags from './PlayerTags'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

class PlayerStats extends Component {
  constructor() {
    super()
    this.state = {
      stats: [],
      playerPositionCode: 'LRCD',
      isAggregate: false,
      reportName: 'skatersummary',
      yearStart: '20182019',
      yearEnd: '20182019',
      teamFilter: 'all',
      teams: '',
      filterTracked: false,
      trackedPlayers: [],
      selectedPlayers: [],
      page: 0,
      rowsPerPage: 10,
      modal: false,
    }

    this._isMounted = false

    this.updateTrackedPlayers = this.updateTrackedPlayers.bind(this)
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

  playersToLocalStorage() {
    const { trackedPlayers } = this.props.stats
    localStorage.setItem('players', JSON.stringify(trackedPlayers))
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

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  handleSeasonChange = name => event => {
    if (name === 'yearStart' && event.target.value > this.state.yearEnd) {
      this.setState({
        yearStart: event.target.value,
        yearEnd: event.target.value,
      })
    } else {
      this.setState({ [name]: event.target.value })
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleRowClick = (event, playerSeasonId) => {
    let newSelectedPlayers = this.state.selectedPlayers.slice()
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

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
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

    const { isAggregate, reportName, yearStart, yearEnd } = this.state

    this.props.startLoad()
    configure().then(async api => {
      const stats = await api
        .get(
          `/api/statistics/${isAggregate.toString()}/${reportName}/${yearStart}/${yearEnd}`
        )
        .then(res => res.data)
        .catch(err => {
          console.log(err)
        })

      console.log(`Received data from ${yearStart} to ${yearEnd} seasons`)

      const teams = !isAggregate
        ? stats
            .reduce((acc, playerObj) => {
              let team = playerObj.playerTeamsPlayedFor
              if (team.length === 3 && !acc.includes(team)) {
                acc.push(team)
              }
              return acc
            }, [])
            .sort()
        : ''

      this.props.stopLoad()
      if (stats && this._isMounted) {
        this.setState({
          stats,
          teams,
          selectedPlayers: [],
          teamFilter: 'all',
        })
      }
    })
  }

  updateTrackedPlayers(playerId, seasonId) {
    const { trackedPlayers } = this.props.stats
    const index = trackedPlayers.indexOf(playerId)

    const dispatchArgs = {
      userId: this.props.auth.user.id,
      playerId,
    }

    if (seasonId === 20182019) {
      if (index === -1) {
        this.props.addPlayerList(dispatchArgs)
      } else {
        this.props.removePlayerList(dispatchArgs)
      }
    }
  }

  render() {
    const {
      stats,
      isAggregate,
      playerPositionCode,
      filterTracked,
      selectedPlayers,
      rowsPerPage,
      page,
      order,
      orderBy,
      teamFilter,
    } = this.state
    const { dataLoad, trackedPlayers } = this.props.stats

    const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true
    let dataDisplay = isSkaters
      ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
      : stats
    dataDisplay = filterTracked
      ? dataDisplay.filter(obj => trackedPlayers.includes(obj.playerId))
      : dataDisplay
    dataDisplay =
      teamFilter !== 'all'
        ? dataDisplay.filter(playerObj =>
            playerObj.playerTeamsPlayedFor.includes(teamFilter)
          )
        : dataDisplay

    console.log('selectedPlayers:', selectedPlayers)
    console.log('trackedPlayers:', trackedPlayers)
    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Player Statistics</h1>
        <StatsFilterPanel
          this={this.state}
          handleChange={this.handleChange}
          handleRowFilter={this.handleRowFilter}
          handleSwitchChange={this.handleSwitchChange}
          handleSeasonChange={this.handleSeasonChange}
          submitQuery={this.submitQuery}
          handleModalOpen={this.handleModalOpen}
        />
        <PlayerTags
          selectedPlayers={selectedPlayers}
          stats={dataDisplay}
          handleRowClick={this.handleRowClick}
        />
        <LinearProgress
          color="secondary"
          style={{
            opacity: dataLoad ? '1' : '0',
            transition: 'all 0.5s',
          }}
        />
        <Paper style={{ overflowX: 'auto' }}>
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
          <Table padding="checkbox">
            <TableData
              dataDisplay={dataDisplay}
              page={page}
              order={order}
              orderBy={orderBy}
              rowsPerPage={rowsPerPage}
              trackedPlayers={trackedPlayers}
              selectedPlayers={selectedPlayers}
              isAggregate={isAggregate}
              handleRowClick={(event, x) => this.handleRowClick(event, x)}
              updateTrackedPlayers={(x, y) => this.updateTrackedPlayers(x, y)}
              handleRequestSort={(event, property) =>
                this.handleRequestSort(event, property)
              }
            />
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  colSpan={3}
                  count={stats.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
        <br />
        <Link to="/">
          <span
            style={{
              marginTop: '1rem',
            }}
          >
            Back to Home
          </span>
        </Link>
        <Dialog
          open={this.state.modal}
          onClose={this.handleModalClose}
          scroll="paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayerComparison
            selectedPlayers={selectedPlayers}
            data={dataDisplay}
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
  startLoad: PropTypes.func.isRequired,
  stopLoad: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  stats: state.stats,
})

export default connect(
  mapStateToProps,
  { getPlayerList, addPlayerList, removePlayerList, startLoad, stopLoad }
)(PlayerStats)
