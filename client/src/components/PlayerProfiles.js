import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ProfileStatTable from './ProfileStatTable'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { removePlayerList } from '../actions/statActions'

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
  position: relative;
  padding: 1rem;
  overflow-x: auto;
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

const RemovePlayerButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem;
  opacity: 0;
  transition: all 0.2s;
  cursor: pointer;

  :hover {
    opacity: 1;
  }
`

const PlayerProfiles = ({ players, auth, removePlayerList }) => {
  return players.map(playerObj => {
    const currentSeasonData = playerObj.stats
      .find(obj => obj.type.displayName === 'yearByYear')
      .splits.find(
        obj =>
          obj.season === '20182019' &&
          obj.league.name === 'National Hockey League'
      ).stat

    const userData = { userId: auth.user.id, playerId: playerObj.id }

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
          <RemovePlayerButton>
            <IconButton
              children={<CloseIcon fontSize="small" />}
              color="secondary"
              onClick={() => removePlayerList(userData)}
            />
          </RemovePlayerButton>
        </TextContainer>
      </ProfileContainer>
    )
  })
}

PlayerProfiles.propTypes = {
  removePlayerList: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { removePlayerList }
)(PlayerProfiles)
