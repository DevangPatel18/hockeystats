import React from 'react'
import styled from 'styled-components'
import { yearFormatter } from '../helper/columnLabels'

const PlayerTagContainerStyles = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
  height: 57px;
`

const PlayerTagStyles = styled.div`
  background-color: #4169e1;
  color: white;
  margin: 0.5rem 1rem 0.5rem 0;
  border-radius: 1.5rem;
  padding: 0.4rem 0.75rem;
  line-height: ${props => (props.seasonId ? '12px' : '')};
  display: flex;
  flex-direction: column;
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

const PlayerTags = ({ selectedPlayers, stats }) => {
  return (
    <PlayerTagContainerStyles>
      {selectedPlayers.map(idx => {
        const [playerId, seasonId] = idx.split('-')
        const playerObj = stats.find(obj => obj.playerId === parseInt(playerId))
        if (!playerObj) return null
        const { playerName } = playerObj
        return (
          <PlayerTagStyles key={idx} seasonId={seasonId}>
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
