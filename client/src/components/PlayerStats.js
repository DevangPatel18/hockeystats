import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
} from '@material-ui/core'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import configure from '../utils/configLocalforage'
import {
  getPlayerList,
  addPlayerList,
  removePlayerList,
} from '../actions/statActions'
import TablePaginationActions from './TablePaginationActions'
import { columns, yearFormatter } from '../helper/columnLabels'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

// Configure 'localforage' and instantiate 'axios' with 'axios-cache-adapter'
configure()

const stopPropagation = event => {
  event.stopPropagation()
}

class PlayerStats extends Component {
  constructor() {
    super()
    this.state = {
      stats: [],
      position: 'LRCD',
      yearStart: '20182019',
      yearEnd: '20182019',
      columns: [],
      trackedPlayers: [],
      selectedPlayers: [],
      page: 0,
      rowsPerPage: 10,
    }

    this._isMounted = false

    this.updateTrackedPlayers = this.updateTrackedPlayers.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    configure().then(api => {
      api
        .get('/api/statistics')
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

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleRowClick = (event, playerId) => {
    let newSelectedPlayers = this.state.selectedPlayers.slice()
    const selectedIndex = newSelectedPlayers.indexOf(playerId)

    console.log('newSelectedPlayers ', newSelectedPlayers)
    if (selectedIndex === -1) {
      newSelectedPlayers.push(playerId)
    } else {
      newSelectedPlayers.splice(selectedIndex, 1)
    }
    this.setState({ selectedPlayers: newSelectedPlayers })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value) })
  }

  submitQuery = e => {
    e.preventDefault()
    const { yearStart, yearEnd } = this.state

    configure().then(async api => {
      const stats = await api
        .put('/api/statistics', { data: { yearStart, yearEnd } })
        .then(res => res.data)
        .catch(err => {
          console.log(err)
        })

      console.log(`Received data from ${yearStart} to ${yearEnd} seasons`)

      this.setState({ stats })
    })
  }

  updateTrackedPlayers(playerId) {
    const newTrackedPlayers = this.state.trackedPlayers.slice()
    const index = newTrackedPlayers.indexOf(playerId)
    const dispatchArgs = {
      userId: this.props.auth.user.id,
      playerId,
    }

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

  render() {
    const {
      stats,
      yearStart,
      position,
      selectedPlayers,
      trackedPlayers,
      rowsPerPage,
      page,
    } = this.state
    const yearCutoff = parseInt(yearStart.slice(0, 4), 10)
    let optionsStart = []
    let optionsEnd = []

    for (let i = 1917; i < 2019; i++) {
      optionsStart.push(
        <option value={`${i}${i + 1}`} key={`${i}-start`}>{`${i}-${i +
          1}`}</option>
      )
    }

    for (let i = yearCutoff; i < 2019; i++) {
      optionsEnd.push(
        <option value={`${i}${i + 1}`} key={`${i}-end`}>{`${i}-${i +
          1}`}</option>
      )
    }

    const dataDisplay = stats.filter(obj =>
      position.includes(obj.playerPositionCode)
    )
    console.log('selectedPlayers:', selectedPlayers)
    console.log('trackedPlayers:', trackedPlayers)

    return (
      <div style={{ fontFamily: 'Arial' }}>
        <h1>Player Statistics</h1>
        <div style={{ margin: '2rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <span
              style={{
                paddingRight: '1rem',
                fontWeight: 'bolder',
                height: '100%',
              }}
            >
              Season Range
            </span>
            <FormControl>
              <InputLabel htmlFor="yearStart" />
              <NativeSelect
                value={this.state.yearStart}
                onChange={this.handleChange('yearStart')}
                input={<Input name="yearStart" id="yearStart" />}
              >
                {optionsStart.map(option => option)}
              </NativeSelect>
            </FormControl>
            <span style={{ padding: '0 1rem' }}> to </span>
            <FormControl>
              <InputLabel htmlFor="yearEnd" />
              <NativeSelect
                value={this.state.yearEnd}
                onChange={this.handleChange('yearEnd')}
                input={<Input name="yearEnd" id="yearEnd" />}
              >
                {optionsEnd.map(option => option)}
              </NativeSelect>
            </FormControl>
          </div>
          <div>
            <FormControl>
              <InputLabel htmlFor="position">Position</InputLabel>
              <NativeSelect
                value={this.state.position}
                onChange={this.handleChange('position')}
                input={<Input name="position" id="position" />}
              >
                <option value={'LRCD'}>All Skaters</option>
                <option value={'LRC'}>Forwards</option>
                <option value={'L'}>Left Wing</option>
                <option value={'R'}>Right Wing</option>
                <option value={'C'}>Center</option>
                <option value={'D'}>Defensemen</option>
              </NativeSelect>
            </FormControl>
          </div>
          <Button
            color="primary"
            variant="contained"
            onClick={this.submitQuery}
            style={{ marginTop: '2rem' }}
          >
            generate data
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            marginBottom: '1rem',
            overflowX: 'auto',
            width: '100%',
          }}
        >
          {this.state.selectedPlayers.map(idx => {
            let playerObj = this.state.stats.find(obj => obj.playerId === idx)
            if (!playerObj) return null
            const { playerName } = playerObj
            return (
              <span
                style={{
                  backgroundColor: '#4169e1',
                  color: 'white',
                  margin: '.5rem',
                  borderRadius: '1.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bolder',
                  whiteSpace: 'nowrap',
                }}
                key={idx}
              >
                {playerName}
              </span>
            )
          })}
        </div>
        <Paper style={{ overflowX: 'auto' }}>
          <Table padding="checkbox">
            <TableHead>
              <TableRow style={{ borderColor: 'none' }}>
                <TableCell
                  component="th"
                  style={{
                    paddingLeft: '24px',
                    color: 'white',
                    background: '#000000',
                    background: 'linear-gradient(to top, #434343, #000000)',
                  }}
                >
                  {columns[0].title}
                </TableCell>
                {columns.slice(1).map(col => (
                  <TableCell
                    align="center"
                    key={col.title}
                    style={{
                      color: 'white',
                      whiteSpace: 'nowrap',
                      background: '#000000',
                      background: 'linear-gradient(to top, #434343, #000000)',
                    }}
                  >
                    {col.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stats
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => (
                  <TableRow
                    key={row.playerId}
                    style={{ height: 'auto' }}
                    selected={selectedPlayers.includes(row.playerId)}
                    onClick={event => this.handleRowClick(event, row.playerId)}
                  >
                    <TableCell
                      component="th"
                      style={{
                        paddingLeft: '24px',
                        whiteSpace: 'nowrap',
                        width: '300px',
                      }}
                    >
                      {row[columns[0].id]}
                    </TableCell>
                    <TableCell
                      style={{
                        paddingLeft: '24px',
                        whiteSpace: 'nowrap',
                        width: '300px',
                      }}
                    >
                      {yearFormatter(row[columns[1].id])}
                    </TableCell>
                    {columns.slice(2).map(col => (
                      <TableCell
                        key={`${row.playerId}-${col.title}`}
                        style={{ whiteSpace: 'nowrap', padding: '3px 12px' }}
                        align="center"
                      >
                        {row[col.id]}
                        {col.id === 'track' && (
                          <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                            checked={this.state.trackedPlayers.includes(
                              row.playerId
                            )}
                            onChange={() =>
                              this.updateTrackedPlayers(row.playerId)
                            }
                            onClick={stopPropagation}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
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
      </div>
    )
  }
}

PlayerStats.propTypes = {
  getPlayerList: PropTypes.func.isRequired,
  addPlayerList: PropTypes.func.isRequired,
  removePlayerList: PropTypes.func.isRequired,
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
  { getPlayerList, addPlayerList, removePlayerList }
)(PlayerStats)
