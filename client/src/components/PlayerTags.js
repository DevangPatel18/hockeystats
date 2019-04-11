import React from 'react'
import styled from 'styled-components'
import { yearFormatter } from '../helper/columnLabels'
import { teamColors } from '../helper/teamColors'

const PlayerTagContainerStyles = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
  height: 73px;
`

const PlayerTagStyles = styled.div`
  background: ${props =>
    `linear-gradient(${props.colors.first} 60%, ${props.colors.second})`};
  color: white;
  margin: 0.5rem 1rem 0.5rem 0;
  border-radius: 1.5rem;
  padding: 0.4rem 0.75rem;
  height: 38px;
  line-height: ${props => (props.seasonId ? '12px' : '')};
  display: flex;
  flex-direction: column;
  font-family: Lato, sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 1px 1px gray;

  &:hover {
    box-shadow: 0 3px 6px gray;
    transform: translateY(-3px);
  }
`

const PlayerTagNameStyles = styled.span`
  font-size: 0.75rem;
  font-weight: bolder;
  white-space: nowrap;
`

const PlayerTagYearStyles = styled.span`
  width: 100%;
  font-size: 0.6rem;
  text-align: right;
`

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

export default PlayerTags
