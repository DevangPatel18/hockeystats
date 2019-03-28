import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Tab, Tabs } from '@material-ui/core/'
import TableComparison from './TableComparison'
import ChartComparison from './ChartComparison'

class PlayerComparison extends Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state
    const { selectedPlayers, data } = this.props
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} variant="fullWidth" onChange={this.handleChange}>
            <Tab label="Table" />
            <Tab label="Chart" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TableComparison selectedPlayers={selectedPlayers} data={data} />
        )}
        {value === 1 && (
          <ChartComparison selectedPlayers={selectedPlayers} data={data} />
        )}
      </div>
    )
  }
}

PlayerComparison.propTypes = {
  selectedPlayers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}

export default PlayerComparison
