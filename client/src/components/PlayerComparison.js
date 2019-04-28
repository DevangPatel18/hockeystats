import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Tab, Tabs, IconButton, Toolbar } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import TableComparison from './TableComparison'
import ChartComparison from './ChartComparison'

class PlayerComparison extends Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state
    const { selectedPlayers, data, yearStart, yearEnd } = this.props
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Tabs
              value={value}
              variant="fullWidth"
              onChange={this.handleChange}
            >
              <Tab label="Table" />
              <Tab label="Chart" />
            </Tabs>
          </Toolbar>
        </AppBar>
        {selectedPlayers.length === 0 ? (
          <div style={{ padding: '2rem' }}>
            Please select rows for comparison
          </div>
        ) : (
          <>
            {value === 0 && (
              <TableComparison selectedPlayers={selectedPlayers} data={data} />
            )}
            {value === 1 && (
              <ChartComparison
                selectedPlayers={selectedPlayers}
                data={data}
                yearStart={yearStart}
                yearEnd={yearEnd}
              />
            )}
          </>
        )}
      </div>
    )
  }
}

PlayerComparison.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedPlayers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  yearStart: PropTypes.string.isRequired,
  yearEnd: PropTypes.string.isRequired,
}

export default PlayerComparison
