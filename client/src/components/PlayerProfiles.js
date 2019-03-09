import React from 'react'
import styled from 'styled-components'
import ProfileStatTable from './ProfileStatTable'

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
`

const ImageContainer = styled.div`
  padding: 1rem;
  text-align: center;
`

const TextContainer = styled.div`
  padding: 1rem;
`

const PlayerBioList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
`

const PlayerBioListItem = styled.li`
  flex: 50%;
  margin-bottom: 0.5rem;
`

const PlayerProfiles = ({ players }) =>
  players.map(playerObj => {
    const currentSeasonData = playerObj.stats
      .find(obj => obj.type.displayName === 'yearByYear')
      .splits.find(
        obj =>
          obj.season === '20182019' &&
          obj.league.name === 'National Hockey League'
      ).stat

    return (
      <ProfileContainer key={playerObj.id} style={{ marginBottom: '1rem' }}>
        <ImageContainer>
          <img
            src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${
              playerObj.id
            }.jpg`}
            alt={playerObj.playerName}
            style={{
              margin: '5px',
              borderRadius: '50%',
              minWidth: '120px',
              boxShadow: '0 0 5px black',
            }}
          />
          <div>#{playerObj.primaryNumber}</div>
        </ImageContainer>

        <TextContainer>
          <h2>{playerObj.fullName}</h2>
          <PlayerBioList>
            <PlayerBioListItem>
              Team: {playerObj.currentTeam.name} -{' '}
              {playerObj.primaryPosition.abbreviation}
            </PlayerBioListItem>
            <PlayerBioListItem>
              Bio: {playerObj.currentAge} yrs - {playerObj.height} ft -{' '}
              {playerObj.weight} lbs
            </PlayerBioListItem>
            <PlayerBioListItem>
              Birthdate: {playerObj.birthDate}
            </PlayerBioListItem>
            <PlayerBioListItem>
              Birthplace: {playerObj.birthCity},
              {playerObj.birthStateProvince &&
                ` ${playerObj.birthStateProvince}, `}{' '}
              {playerObj.birthCountry}
            </PlayerBioListItem>
          </PlayerBioList>
          <ProfileStatTable stats={currentSeasonData} />
        </TextContainer>
      </ProfileContainer>
    )
  })

export default PlayerProfiles
