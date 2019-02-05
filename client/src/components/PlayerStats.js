import React, { Component } from 'react'
import { Link } from 'gatsby'
import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Button,
} from '@material-ui/core'
import 'react-tabulator/lib/styles.css' // required styles
import 'react-tabulator/lib/css/tabulator.min.css' // theme
import configure from '../utils/configLocalforage'
import { ReactTabulator } from 'react-tabulator' // for React 15.x, use import { React15Tabulator }

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
    }

    this._isMounted = false
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
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
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
        <ReactTabulator
          columns={columns}
          data={dataDisplay}
          options={{
            pagination: 'local',
            paginationSize: 20,
            layout: 'fitDataFill',
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

export default PlayerStats
