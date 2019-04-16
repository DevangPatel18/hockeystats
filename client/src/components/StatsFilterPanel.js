import React from 'react'
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
import styled from 'styled-components'

const tabletWidth = '425px'
const mobileWidth = '900px'

const StatsPanel = styled.div`
  position: relative;
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  margin: 1rem 0;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: ${mobileWidth}) {
    justify-content: space-evenly;
  }

  &::before {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -1.8rem);
    padding: 0 4px;
    background: white;
    font-weight: 600;
    font-size: 0.8rem;
    color: #757575;
    content: ${props =>
      props.title
        ? `
    '${props.title}'
    `
        : ''};
  }
`

const YearRange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  @media (max-width: ${mobileWidth}) {
    flex-wrap: wrap;
  }
`

const YearRangeLabel = styled.div`
  padding-right: 1rem;
  font-weight: bolder;
  font-size: 0.8rem;

  @media (max-width: ${tabletWidth}) {
    padding: 0 0 0.5rem;
  }
`

const StatsFilterPanel = props => {
  const {
    isAggregate,
    reportName,
    yearStart,
    yearEnd,
    playerPositionCode,
    filterTracked,
    teamFilter,
    teams,
    countryFilter,
    countries,
    search,
  } = props.this

  const {
    handleChange,
    handleRowFilter,
    handleSwitchChange,
    handleSeasonChange,
    submitQuery,
    handleModalOpen,
  } = props

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
      <option value={`${i}${i + 1}`} key={`${i}-end`}>{`${i}-${i + 1}`}</option>
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
            input={<Input name="playerPositionCode" id="playerPositionCode" />}
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

export default StatsFilterPanel
