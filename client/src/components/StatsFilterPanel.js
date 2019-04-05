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
            value={yearStart}
            onChange={handleSeasonChange('yearStart')}
            input={<Input name="yearStart" id="yearStart" />}
          >
            {optionsStart.map(option => option)}
          </NativeSelect>
        </FormControl>
        <span style={{ padding: '0 1rem' }}> to </span>
        <FormControl>
          <InputLabel htmlFor="yearEnd" />
          <NativeSelect
            value={yearEnd}
            onChange={handleSeasonChange('yearEnd')}
            input={<Input name="yearEnd" id="yearEnd" />}
          >
            {optionsEnd.map(option => option)}
          </NativeSelect>
        </FormControl>
      </div>
      <FormControl>
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
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={isAggregate}
            onChange={handleSwitchChange('isAggregate')}
          />
        }
        label="Sum Results"
      />
      <div>
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
        <FormControlLabel
          control={
            <Switch
              checked={filterTracked}
              onChange={handleSwitchChange('filterTracked')}
            />
          }
          label="Tracked Players Only"
        />
      </div>
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
          style={{width: '170px'}}
        />
      </div>
    </div>
  )
}

export default StatsFilterPanel
