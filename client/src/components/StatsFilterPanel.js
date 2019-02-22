import React from 'react'
import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Button,
} from '@material-ui/core'

const StatsFilterPanel = props => {
  const { yearStart, yearEnd, position, handleSeasonChange, submitQuery } = props

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
      <div>
        <FormControl>
          <InputLabel htmlFor="position">Position</InputLabel>
          <NativeSelect
            value={position}
            onChange={handleSeasonChange('position')}
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
        onClick={submitQuery}
        style={{ marginTop: '2rem' }}
      >
        generate data
      </Button>
    </div>
  )
}

export default StatsFilterPanel
