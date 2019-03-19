import React, { Component } from 'react'

class ChartComparison extends Component {
  render() {
    const { players, data } = this.props
    return (
      <div>{players.map(playerId => <div key={playerId}>{playerId}</div>)}</div>
    )
  }
}

export default ChartComparison
