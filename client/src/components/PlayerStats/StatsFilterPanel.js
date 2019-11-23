import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  Select,
  Button,
  Switch,
  TextField,
} from '@material-ui/core'
import {
  StatsPanel,
  YearRange,
  YearRangeLabel,
  FormControlStyles,
} from '../styles/StatsFilterPanelStyles'
import { getCurrentSeasonId } from '../../helper/dateHelpers'

const currentSeasonYearEnd = getCurrentSeasonId().slice(4)

class StatsFilterPanel extends Component {
  handleSeasonChange = name => event => {
    this.props.changeSeason(name, event.target.value)
  }

  handleChange = name => event => {
    this.props.changeField(name, event.target.value)
  }

  handleChangeMultiple = event => {
    const optionList = [...event.target.options].reduce((acc, option) => {
      if (option.selected) {
        acc.push(option.value)
      }
      return acc
    }, [])
    this.props.changeField(event.target.name, optionList)
  }

  handleToggle = name => event => {
    this.props.toggleSwitch(name)
  }

  render() {
    const { handleRowFilter, submitQuery, handleModalOpen } = this.props
    const { teams, countries } = this.props.playerData

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
              <option value="skatersummary">Skaters</option>
              <option value="goaliesummary">Goaltenders</option>
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
            <Select
              value={teamFilter}
              multiple
              native
              onChange={this.handleChangeMultiple}
              inputProps={{ name: 'teamFilter', id: 'teamFilter' }}
            >
              {teams &&
                teams.map(teamCode => (
                  <option key={teamCode} value={teamCode}>
                    {teamCode}
                  </option>
                ))}
            </Select>
          <FormControl style={{ marginRight: '1rem' }}>
          </FormControlStyles>
            <InputLabel htmlFor="playerPositionCode">Position</InputLabel>
            <NativeSelect
              value={playerPositionCode}
              onChange={handleRowFilter('playerPositionCode')}
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
          </FormControl>
          <FormControl style={{ marginRight: '1rem' }}>
            <InputLabel htmlFor="countryFilter">Country</InputLabel>
            <NativeSelect
              value={countryFilter}
              onChange={handleRowFilter('countryFilter')}
              input={<Input name="countryFilter" id="countryFilter" />}
            >
              <option value={'all'}>All Countries</option>
              {countries &&
                countries.map(countryCode => (
                  <option value={countryCode} key={countryCode}>
                    {countryCode}
                  </option>
                ))}
            </NativeSelect>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={filterTracked}
                onChange={this.handleToggle('filterTracked')}
              />
            }
            label="Tracked Players Only"
          />
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
            onClick={submitQuery}
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
  submitQuery: PropTypes.func.isRequired,
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
