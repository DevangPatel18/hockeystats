import React from 'react'
import styled from 'styled-components'
import { yearFormatter } from '../helper/columnLabels'

const PlayerTagContainerStyles = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
`

const PlayerTagStyles = styled.div`
  background-color: #4169e1;
  color: white;
  margin: 0.5rem;
  border-radius: 1.5rem;
  padding: 0.4rem 0.75rem;
  line-height: 12px;
  display: flex;
  flex-direction: column;
`

const PlayerTagNameStyles = styled.span`
  font-size: 0.75rem;
  font-weight: bolder;
  white-space: nowrap;
`

const PlayerTagYearStyles = styled.span`
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
          <PlayerTagStyles key={idx}>
            <PlayerTagNameStyles>{playerName}</PlayerTagNameStyles>
            <PlayerTagYearStyles>{yearFormatter(seasonId)}</PlayerTagYearStyles>
          </PlayerTagStyles>
        )
      })}
    </PlayerTagContainerStyles>
  )
}

export default PlayerTags
