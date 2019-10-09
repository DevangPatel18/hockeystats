import React, { Component } from 'react'
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
} from '../styles/StatsFilterPanelStyles'

class StatsFilterPanel extends Component {
  render() {
    const {
      isAggregate,
      reportName,
      yearStart,
      yearEnd,
      playoffs,
      playerPositionCode,
      filterTracked,
      teamFilter,
      teams,
      countryFilter,
      countries,
      search,
    } = this.props

    const {
      handleChange,
      handleRowFilter,
      handleSwitchChange,
      handleSeasonChange,
      submitQuery,
      handleModalOpen,
    } = this.props

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
                  onChange={handleSeasonChange('yearStart')}
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
                  onChange={handleSeasonChange('yearEnd')}
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
              onChange={handleChange('reportName')}
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
                onChange={handleSwitchChange('playoffs')}
              />
            }
            label={'Playoffs'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isAggregate}
                onChange={handleSwitchChange('isAggregate')}
              />
            }
            label="Sum Results"
          />
        </StatsPanel>
        <StatsPanel title={'Filters'}>
          <FormControl style={{ marginRight: '1rem' }}>
            <InputLabel htmlFor="teamFilter">Teams</InputLabel>
            <NativeSelect
              value={teamFilter}
              onChange={handleChange('teamFilter')}
              input={<Input name="teamFilter" id="teamFilter" />}
            >
              <option value={'all'}>All Teams</option>
              {teams &&
                teams.map(teamCode => (
                  <option value={teamCode} key={teamCode}>
                    {teamCode}
                  </option>
                ))}
            </NativeSelect>
          </FormControl>
          <FormControl style={{ marginRight: '1rem' }}>
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
                onChange={handleSwitchChange('filterTracked')}
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
            onChange={handleChange('search')}
            variant="outlined"
            style={{ width: '170px' }}
          />
        </div>
      </div>
    )
  }
}

StatsFilterPanel.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleRowFilter: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired,
  handleSeasonChange: PropTypes.func.isRequired,
  submitQuery: PropTypes.func.isRequired,
  handleModalOpen: PropTypes.func.isRequired,
}

export default StatsFilterPanel
