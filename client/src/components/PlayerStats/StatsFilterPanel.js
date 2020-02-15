import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isMobile } from 'react-device-detect'
import {
  changeSeason,
  changeField,
  toggleSwitch,
} from '../../actions/tableSettingsActions'
import PropTypes from 'prop-types'
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  NativeSelect,
  Button,
  Switch,
  TextField,
} from '@material-ui/core'
import {
  StatsPanel,
  YearRange,
  YearRangeLabel,
  FormControlStyles,
  ChipStyles,
} from '../styles/StatsFilterPanelStyles'
import { getCurrentSeasonId } from '../../helper/dateHelpers'
import franchises from '../../helper/franchises'
import countries from '../../helper/countries'
import { skaterReportTypes, goalieReportTypes } from '../../helper/reportTypes'

const currentSeasonYearEnd = getCurrentSeasonId().slice(4)

class StatsFilterPanel extends Component {
  handleSeasonChange = name => event => {
    this.props.changeSeason(name, event.target.value)
  }

  handleChange = name => event => {
    this.props.changeField(name, event.target.value)
  }

  handleChangeMultiple = event => {
    const optionList = isMobile
      ? [...event.target.options].reduce((acc, option) => {
          if (option.selected) {
            acc.push(option.value)
          }
          return acc
        }, [])
      : event.target.value
    this.props.changeField(event.target.name, optionList)
  }

  handleToggle = name => event => {
    this.props.toggleSwitch(name)
  }

  handleRenderValue = selected => (
    <div>
      {selected.map(value => (
        <ChipStyles key={value} label={value} />
      ))}
    </div>
  )

  render() {
    const { handleSubmitQuery, handleModalOpen } = this.props

    const {
      yearStart,
      yearEnd,
      reportName,
      playoffs,
      isAggregate,
      filterTracked,
      search,
      playerPositionCode,
      countryFilter,
      teamFilter,
      opponentFilter,
      gameResult,
      location,
    } = this.props.tableSettings

    const yearCutoff = parseInt(yearStart.slice(0, 4), 10)
    let optionsStart = []
    let optionsEnd = []

    for (let i = 1917; i < currentSeasonYearEnd; i++) {
      optionsStart.push(
        <option value={`${i}${i + 1}`} key={`${i}-start`}>{`${i}-${i +
          1}`}</option>
      )
    }

    for (let i = yearCutoff; i < currentSeasonYearEnd; i++) {
      optionsEnd.push(
        <option value={`${i}${i + 1}`} key={`${i}-end`}>{`${i}-${i +
          1}`}</option>
      )
    }

    return (
      <div style={{ margin: '2rem 0 1rem' }}>
        <StatsPanel title={'Settings'}>
          <YearRange>
            <YearRangeLabel>Season Range</YearRangeLabel>
            <div>
              <FormControl>
                <InputLabel htmlFor="yearStart">Year start</InputLabel>
                <NativeSelect
                  value={yearStart}
                  onChange={this.handleSeasonChange('yearStart')}
                  input={<Input name="yearStart" id="yearStart" />}
                >
                  {optionsStart.map(option => option)}
                </NativeSelect>
              </FormControl>
              <span style={{ padding: '0 1rem' }}> to </span>
              <FormControl>
                <InputLabel htmlFor="yearEnd">Year End</InputLabel>
                <NativeSelect
                  value={yearEnd}
                  onChange={this.handleSeasonChange('yearEnd')}
                  input={<Input name="yearEnd" id="yearEnd" />}
                >
                  {optionsEnd.map(option => option)}
                </NativeSelect>
              </FormControl>
            </div>
          </YearRange>
          <FormControl style={{ margin: '0 1rem' }}>
            <InputLabel htmlFor="reportName">Report Type</InputLabel>
            <NativeSelect
              value={reportName}
              onChange={this.handleChange('reportName')}
              input={<Input name="reportName" id="reportName" />}
              name="reportName"
            >
              <optgroup label="Skaters">
                {skaterReportTypes.map(obj => (
                  <option key={obj.report} value={obj.report}>
                    {obj.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Goalies">
                {goalieReportTypes.map(obj => (
                  <option key={obj.report} value={obj.report}>
                    {obj.title}
                  </option>
                ))}
              </optgroup>
            </NativeSelect>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={playoffs}
                onChange={this.handleToggle('playoffs')}
              />
            }
            label={'Playoffs'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isAggregate}
                onChange={this.handleToggle('isAggregate')}
              />
            }
            label="Sum Results"
          />
        </StatsPanel>
        <StatsPanel title={'Filters'}>
          <FormControlStyles>
            <InputLabel htmlFor="teamFilter">Teams</InputLabel>
            <NativeSelect
              value={teamFilter}
              onChange={this.handleChange('teamFilter')}
              inputProps={{ name: 'teamFilter', id: 'teamFilter' }}
            >
              <option value={'all'}>All teams</option>
              {franchises.map(team => (
                <option key={team.id} value={team.id}>
                  {team.fullName}
                </option>
              ))}
            </NativeSelect>
          </FormControlStyles>
          <FormControlStyles>
            <InputLabel htmlFor="playerPositionCode">Position</InputLabel>
            <NativeSelect
              value={playerPositionCode}
              onChange={this.handleChange('playerPositionCode')}
              input={
                <Input name="playerPositionCode" id="playerPositionCode" />
              }
            >
              <option value={'LRCD'}>All Skaters</option>
              <option value={'LRC'}>Forwards</option>
              <option value={'L'}>Left Wing</option>
              <option value={'R'}>Right Wing</option>
              <option value={'C'}>Center</option>
              <option value={'D'}>Defensemen</option>
            </NativeSelect>
          </FormControlStyles>
          <FormControlStyles>
            <InputLabel htmlFor="countryFilter">Country</InputLabel>
            <NativeSelect
              value={countryFilter}
              onChange={this.handleChange('countryFilter')}
              inputProps={{ name: 'countryFilter', id: 'countryFilter' }}
            >
              <option value={'all'}>All countries</option>
              {countries.map(country => (
                <option value={country.id} key={country.id}>
                  {country.countryName}
                </option>
              ))}
            </NativeSelect>
          </FormControlStyles>
          <FormControlLabel
            control={
              <Switch
                checked={filterTracked}
                onChange={this.handleToggle('filterTracked')}
              />
            }
            label="Tracked Players Only"
          />
          <div style={{ marginTop: '1rem' }}>
            <FormControlStyles>
              <InputLabel htmlFor="opponentFilter">Opponent</InputLabel>
              <NativeSelect
                value={opponentFilter}
                onChange={this.handleChange('opponentFilter')}
                inputProps={{ name: 'opponentFilter', id: 'opponentFilter' }}
              >
                <option value={'all'}>All teams</option>
                {franchises.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.fullName}
                  </option>
                ))}
              </NativeSelect>
            </FormControlStyles>
            <FormControlStyles>
              <InputLabel htmlFor="gameResult">Game result</InputLabel>
              <NativeSelect
                value={gameResult}
                onChange={this.handleChange('gameResult')}
                inputProps={{ name: 'gameResult', id: 'gameResult' }}
              >
                <option value={'all'}>All Results</option>
                <option value={'W'}>Win</option>
                <option value={'L'}>Loss</option>
                <option value={'O'}>Overtime Loss</option>
              </NativeSelect>
            </FormControlStyles>
            <FormControlStyles>
              <InputLabel htmlFor="location">Game location</InputLabel>
              <NativeSelect
                value={location}
                onChange={this.handleChange('location')}
                inputProps={{ name: 'location', id: 'location' }}
              >
                <option value={'all'}>Home + Road</option>
                <option value={'H'}>Home</option>
                <option value={'R'}>Road</option>
              </NativeSelect>
            </FormControlStyles>
          </div>
        </StatsPanel>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmitQuery}
            style={{ marginBottom: '1rem' }}
          >
            generate data
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleModalOpen}
            style={{
              fontWeight: 'bolder',
              marginLeft: '1rem',
            }}
          >
            compare selected
          </Button>
          <div style={{ flexGrow: '1', marginRight: '1rem' }} />
          <TextField
            id="player-search-input"
            label="Search"
            value={search}
            onChange={this.handleChange('search')}
            variant="outlined"
            style={{ width: '170px' }}
          />
        </div>
      </div>
    )
  }
}

StatsFilterPanel.propTypes = {
  handleRowFilter: PropTypes.func.isRequired,
  handleSubmitQuery: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  tableSettings: state.tableSettings,
  playerData: state.playerData,
})

export default connect(
  mapStateToProps,
  { changeSeason, changeField, toggleSwitch }
)(StatsFilterPanel)
