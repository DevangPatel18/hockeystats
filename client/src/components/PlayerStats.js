import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Button,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import 'react-tabulator/lib/styles.css' // required styles
import 'react-tabulator/lib/css/tabulator.min.css' // theme
import configure from '../utils/configLocalforage'
import { ReactTabulator } from 'react-tabulator' // for React 15.x, use import { React15Tabulator }
import {
  getPlayerList,
  addPlayerList,
  removePlayerList,
} from '../actions/statActions'

// Marking event handler as 'passive' in response to console violations
require('default-passive-events')

// Configure 'localforage' and instantiate 'axios' with 'axios-cache-adapter'
configure()

const yearFormatter = cell => {
  let yearsFormat = cell
    .getValue()
    .toString()
    .slice()
    .split('')
  yearsFormat.splice(4, 2, '-')
  yearsFormat = yearsFormat.join('')

  return yearsFormat
}

const columns = [
  { title: 'Name', field: 'playerName', width: 200, frozen: true },
  { title: 'Season', field: 'seasonId', formatter: yearFormatter },
  { title: 'Team', field: 'playerTeamsPlayedFor' },
  { title: 'G', field: 'goals' },
  { title: 'A', field: 'assists' },
  { title: 'P', field: 'points' },
  { title: 'Height', field: 'playerHeight' },
  { title: 'GP', field: 'gamesPlayed' },
  { title: 'Country', field: 'playerBirthCountry' },
  { title: 'DOB', field: 'playerBirthDate' },
  { title: 'Draft #', field: 'playerDraftOverallPickNo' },
  { title: 'Draft Year', field: 'playerDraftYear' },
  { title: 'Pos', field: 'playerPositionCode' },
  { title: 'Weight', field: 'playerWeight' },
  { title: '+/-', field: 'plusMinus' },
  { title: 'P/G', field: 'pointsPerGame' },
  { title: 'PPG', field: 'ppGoals' },
  { title: 'PPP', field: 'ppGoals' },
  { title: 'SHG', field: 'shGoals' },
  { title: 'SHP', field: 'shPoints' },
  { title: 'Shifts/G', field: 'shPoints' },
  { title: 'S%', field: 'shootingPctg' },
  { title: 'TOI/G', field: 'timeOnIcePerGame' },
]

class PlayerStats extends Component {
  constructor() {
    super()
    this.state = {
      stats: [],
      position: 'LRCD',
      yearStart: '20182019',
      yearEnd: '20182019',
      columns: [],
      selectedPlayers: [],
    }

    this._isMounted = false

    this.rowSelection = this.rowSelection.bind(this)
    this.rowColor = this.rowColor.bind(this)
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
          selectedPlayers: JSON.parse(localStorage.getItem('players')),
        })
        window.addEventListener(
          'beforeunload',
          this.playersToLocalStorage.bind(this)
        )
      }
    }
  }

  playersToLocalStorage() {
    localStorage.setItem('players', JSON.stringify(this.state.selectedPlayers))
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      return {
        selectedPlayers: [...nextProps.stats.selectedPlayers],
      }
    }
    return null
  }

  componentWillUnmount() {
    this._isMounted = false

    if (!this.props.auth.isAuthenticated) {
      window.removeEventListener(
        'beforeunload',
        this.playersToLocalStorage.bind(this)
      )
      this.playersToLocalStorage()
    }
  }

  handleChange = name => event => {
    const scroll = window.scrollY
    this.setState({ [name]: event.target.value }, () => {
      window.scrollTo(0, scroll)
    })
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

  rowSelection(row) {
    const newTrackedPlayers = this.state.selectedPlayers.slice()
    const index = newTrackedPlayers.indexOf(row._row.data.playerId)
    const dispatchArgs = {
      userId: this.props.auth.user.id,
      playerId: row._row.data.playerId,
    }

    if (this.props.auth.isAuthenticated) {
      if (index === -1) {
        this.props.addPlayerList(dispatchArgs)
      } else {
        this.props.removePlayerList(dispatchArgs)
      }
    } else {
      if (index === -1) {
        newTrackedPlayers.push(row._row.data.playerId)
        row.select()
      } else {
        newTrackedPlayers.splice(index, 1)
      }

      const scroll = window.scrollY

      this.setState({ selectedPlayers: newTrackedPlayers }, () => {
        window.scrollTo(0, scroll)
      })
    }
  }

  rowColor(row) {
    const { selectedPlayers } = this.state
    if (selectedPlayers.includes(row._row.data.playerId)) {
      row.getElement().style.backgroundColor = 'rgba(255,228,85,0.75)'
    }
  }

  render() {
    const { stats, yearStart, position } = this.state
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
          style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}
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
                }}
                key={idx}
              >
                {playerName}
              </span>
            )
          })}
        </div>
        <ReactTabulator
          columns={columns}
          data={dataDisplay}
          options={{
            pagination: 'local',
            paginationSize: 20,
            layout: 'fitDataFill',
            selectable: true,
            rowSelected: this.rowSelection,
            rowFormatter: this.rowColor,
          }}
        />
        <Link
          to="/"
          style={{
            borderRadius: '3px',
            letterSpacing: '1.5px',
          }}
        >
          Back to Home
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
