import React from 'react'

const PlayerProfiles = ({ players }) =>
  players.map(playerObj => (
    <div key={playerObj.id} style={{ marginBottom: '1rem' }}>
      <h4>{playerObj.fullName}</h4>
      <div>
        Team: {playerObj.currentTeam.name} -{' '}
        {playerObj.primaryPosition.abbreviation} - #{playerObj.primaryNumber}
      </div>
      <div>
        Bio: {playerObj.currentAge} yrs - {playerObj.height} ft -{' '}
        {playerObj.weight} lbs
      </div>
      <div>Birthdate: {playerObj.birthDate}</div>
      <div>
        Birthplace: {playerObj.birthCity},
        {playerObj.birthStateProvince &&
          ` ${playerObj.birthStateProvince}, `}{' '}
        {playerObj.birthCountry}
      </div>
    </div>
  ))

export default PlayerProfiles
