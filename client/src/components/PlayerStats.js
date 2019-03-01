import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  Table,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Modal,
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
// import PlayerComparison from './PlayerComparison'
import PlayerTags from './PlayerTags'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

// Configure 'localforage' and instantiate 'axios' with 'axios-cache-adapter'
configure()

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
    const { isAggregate, reportName, yearStart, yearEnd } = this.state
    this._isMounted = true
    configure().then(api => {
      api
        .get(
          `/api/statistics/${isAggregate.toString()}/${reportName}/${yearStart}/${yearEnd}`
        )
        .then(res => {
          if (this._isMounted) {
            this.setState({ stats: res.data })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })

    if (this.props.auth.isAuthenticated) {
      this.props.getPlayerList(this.props.auth.user.id)
    } else {
      if (localStorage.hasOwnProperty('players')) {
        this.setState({
          trackedPlayers: JSON.parse(localStorage.getItem('players')),
        })
        window.addEventListener(
          'beforeunload',
          this.playersToLocalStorage.bind(this)
        )
      }
    }
  }

  playersToLocalStorage() {
    localStorage.setItem('players', JSON.stringify(this.state.trackedPlayers))
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      return {
        trackedPlayers: [...nextProps.stats.trackedPlayers],
      }
    }
    return null
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
    e.preventDefault()
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

      this.props.stopLoad()
      if (stats) {
        this.setState({ stats, selectedPlayers: [] })
      }
    })
  }

  updateTrackedPlayers(playerId, seasonId) {
    const newTrackedPlayers = this.state.trackedPlayers.slice()
    const index = newTrackedPlayers.indexOf(playerId)
    const dispatchArgs = {
      userId: this.props.auth.user.id,
      playerId,
    }

    if (seasonId === 20182019) {
      if (this.props.auth.isAuthenticated) {
        if (index === -1) {
          this.props.addPlayerList(dispatchArgs)
        } else {
          this.props.removePlayerList(dispatchArgs)
        }
      } else {
        if (index === -1) {
          newTrackedPlayers.push(playerId)
        } else {
          newTrackedPlayers.splice(index, 1)
        }

        this.setState({
          trackedPlayers: newTrackedPlayers,
          [playerId]: !this.state[playerId],
        })
      }
    }
  }

  render() {
    const {
      stats,
      isAggregate,
      reportName,
      yearStart,
      yearEnd,
      playerPositionCode,
      selectedPlayers,
      trackedPlayers,
      rowsPerPage,
      page,
      order,
      orderBy,
    } = this.state
    const { dataLoad } = this.props.stats

    const isSkaters = stats[0] ? stats[0]['playerPositionCode'] !== 'G' : true
    const dataDisplay = isSkaters
      ? stats.filter(obj => playerPositionCode.includes(obj.playerPositionCode))
      : stats

    console.log('selectedPlayers:', selectedPlayers)
    console.log('trackedPlayers:', trackedPlayers)
    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Player Statistics</h1>
        <StatsFilterPanel
          isAggregate={isAggregate}
          reportName={reportName}
          yearStart={yearStart}
          yearEnd={yearEnd}
          playerPositionCode={playerPositionCode}
          selectedPlayers={selectedPlayers}
          handleChange={this.handleChange}
          handleRowFilter={this.handleRowFilter}
          handleSwitchChange={this.handleSwitchChange}
          handleSeasonChange={this.handleSeasonChange}
          submitQuery={this.submitQuery}
          handleModalOpen={this.handleModalOpen}
        />
        <PlayerTags selectedPlayers={selectedPlayers} stats={dataDisplay} />
        <LinearProgress
          color="secondary"
          style={{
            opacity: dataLoad ? '1' : '0',
            transition: 'all 0.5s',
          }}
        />
        <Paper style={{ overflowX: 'auto' }}>
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
        <Modal
          open={this.state.modal}
          onClose={this.handleModalClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <Paper>
            <PlayerComparison players={selectedPlayers} data={dataDisplay} />
          </Paper> */}
        </Modal>
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
