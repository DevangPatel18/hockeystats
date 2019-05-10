import React from 'react'
import styled from 'styled-components'
import { Trail, animated } from 'react-spring/renderprops'
import PropTypes from 'prop-types'
import ProfileStatTable from './ProfileStatTable'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { removePlayerList } from '../actions/statActions'
import { yearFormatter } from '../helper/columnLabels'

const mobileWidth = '425px'
const tabletWidth = '800px'

const ProfileContainer = styled.div`
  box-shadow: 3px 3px 8px lightgray;
  padding-bottom: 0.3rem;
  margin-bottom: 2rem;
  font-size: 1rem;

  @media (max-width: ${mobileWidth}) {
    font-size: 0.85rem;
  }
`

const PlayerIdent = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 1rem;

  &:before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: '';
    background: ${props => `url(${props.logoUrl}) no-repeat right`};
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    text-align: center;
  }
`

const ImageContainer = styled.div`
  padding: 1rem 1rem 0;
  text-align: center;
  max-width: 180px;

  @media (max-width: ${mobileWidth}) {
    margin: 0 auto;
    max-width: 120px;
  }
`

const TextContainer = styled.div`
  position: relative;
  overflow-x: auto;
  margin: 1rem 1rem 0;
`

const PlayerBioList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`

const PlayerBioListItem = styled.li`
  flex: 50%;
  margin-bottom: 0.5rem;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 0.1rem;
  }
`

const RemovePlayerButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem;
  opacity: 1;
  transition: all 0.2s;
  cursor: pointer;
`

const PlayerProfiles = ({ players, auth, removePlayerList }) => {
  const profiles = players.map(playerObj => {
    const seasonData = playerObj.stats
      .find(obj => obj.type.displayName === 'yearByYear')
      .splits.find(
        obj =>
          obj.season === playerObj.seasonId.toString() &&
          obj.league.name === 'National Hockey League'
      )

    const userData = {
      userId: auth.user.id,
      playerId: playerObj.id,
      seasonId: playerObj.seasonId,
    }

    const bDay = new Date(playerObj.birthDate)
    let bDayStr = bDay.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })

    console.log(playerObj)
    const logoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${
      seasonData.team.id
    }.svg`

    return (
      <ProfileContainer key={`${playerObj.id}-${playerObj.seasonId}`}>
        <PlayerIdent logoUrl={logoUrl}>
          <ImageContainer>
            <img
              src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${
                playerObj.id
              }.jpg`}
              alt={playerObj.playerName}
              style={{
                margin: '0',
                borderRadius: '50%',
                width: 'auto',
                boxShadow: '0 0 5px black',
              }}
            />
            <div style={{ fontWeight: '600' }}>#{playerObj.primaryNumber}</div>
          </ImageContainer>

          <TextContainer>
            <h2 style={{ marginBottom: '0.7rem' }}>
              {playerObj.fullName} ({yearFormatter(playerObj.seasonId)})
            </h2>
            <PlayerBioList>
              <PlayerBioListItem>
                Team: {seasonData.team.name} -{' '}
                {playerObj.primaryPosition.abbreviation}
              </PlayerBioListItem>
              <PlayerBioListItem>
                Bio: {playerObj.currentAge} yrs - {playerObj.height} ft -{' '}
                {playerObj.weight} lbs
              </PlayerBioListItem>
              <PlayerBioListItem>Birthdate: {bDayStr}</PlayerBioListItem>
              <PlayerBioListItem>
                Birthplace: {playerObj.birthCity},
                {playerObj.birthStateProvince &&
                  ` ${playerObj.birthStateProvince}, `}{' '}
                {playerObj.birthCountry}
              </PlayerBioListItem>
            </PlayerBioList>
          </TextContainer>
        </PlayerIdent>
        <ProfileStatTable stats={seasonData.stat} />
        <RemovePlayerButton>
          <IconButton
            children={<CloseIcon fontSize="small" />}
            color="secondary"
            onClick={() => removePlayerList(userData)}
          />
        </RemovePlayerButton>
      </ProfileContainer>
    )
  })

  return (
    <Trail
      native
      items={profiles}
      keys={profile => profile.key}
      from={{ opacity: 0, x: -100 }}
      to={{ opacity: 1, x: 0 }}
    >
      {profile => ({ x, opacity }) => (
        <animated.div
          style={{
            opacity,
            transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
          }}
        >
          {profile}
        </animated.div>
      )}
    </Trail>
  )
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
