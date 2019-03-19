import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Tab, Tabs } from '@material-ui/core/'
import TableComparison from './TableComparison'

class PlayerComparison extends Component {
  state = { value: 0 }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  render() {
    const { value } = this.state
    const { players, data } = this.props
    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Table" />
          </Tabs>
        </AppBar>
        {value === 0 && <TableComparison players={players} data={data} />}
      </div>
    )
  }
}

PlayerComparison.propTypes = {
  players: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
}

export default PlayerComparison
