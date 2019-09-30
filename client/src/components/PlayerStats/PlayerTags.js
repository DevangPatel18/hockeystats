import React from 'react'
import PropTypes from 'prop-types'
import {
  PlayerTagContainerStyles,
  PlayerTagStyles,
  PlayerTagNameStyles,
  PlayerTagYearStyles,
} from '../styles/PlayerTagsStyles'
import { yearFormatter } from '../../helper/columnLabels'
import { teamColors } from '../../helper/teamColors'

const PlayerTags = ({ selectedPlayers, stats, handleRowClick }) => {
  return (
    <PlayerTagContainerStyles>
      {selectedPlayers.map(idx => {
        const [playerId, seasonId, teamCodes] = idx.split('-')
        let colors

        if (teamCodes) {
          const teams =
            teamCodes.length > 3 ? teamCodes.split(', ')[0] : teamCodes
          colors = teamColors[teams] || { first: 'black', second: 'grey' }
        } else {
          colors = { first: '#283048', second: '#859398' }
        }

        const playerObj = stats.find(obj => obj.playerId === parseInt(playerId))
        if (!playerObj) return null
        const { playerName } = playerObj
        return (
          <PlayerTagStyles
            key={idx}
            seasonId={seasonId}
            colors={colors}
            onClick={() => handleRowClick(null, idx)}
            style={{ cursor: 'pointer' }}
          >
            <PlayerTagNameStyles>{playerName}</PlayerTagNameStyles>
            {seasonId && (
              <PlayerTagYearStyles>
                {yearFormatter(seasonId)}
              </PlayerTagYearStyles>
            )}
          </PlayerTagStyles>
        )
      })}
    </PlayerTagContainerStyles>
  )
}

PlayerTags.propTypes = {
  selectedPlayers: PropTypes.array.isRequired,
  stats: PropTypes.array.isRequired,
  handleRowClick: PropTypes.func.isRequired,
}

export default PlayerTags
