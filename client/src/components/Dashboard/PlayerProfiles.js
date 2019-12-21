import React from 'react'
import { Trail, animated } from 'react-spring/renderprops'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import { TableChart, Close } from '@material-ui/icons'
import { connect } from 'react-redux'
import {
  ProfileContainer,
  PlayerIdent,
  ImageContainer,
  TextContainer,
  PlayerBioList,
  PlayerBioListItem,
  RemovePlayerButton,
} from '../styles/PlayerProfileStyles'
import ProfileStatTable from './ProfileStatTable'
import { removePlayerList, openPlayerModal } from '../../actions/statActions'
import { yearFormatter } from '../../helper/columnLabels'

const PlayerProfiles = ({
  players,
  auth,
  removePlayerList,
  openPlayerModal,
}) => {
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
      playerPositionCode:
        playerObj.playerPositionCode || playerObj.primaryPosition.code,
      playerName: playerObj.fullName,
    }

    const bDay = new Date(playerObj.birthDate)
    let bDayStr = bDay.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })

    const age = playerObj.currentAge ? `${playerObj.currentAge} yrs - ` : ''

    const logoUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${seasonData.team.id}.svg`

    return (
      <ProfileContainer key={`${playerObj.id}-${playerObj.seasonId}`}>
        <PlayerIdent logoUrl={logoUrl}>
          <ImageContainer>
            <img
              src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${playerObj.id}.jpg`}
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
                Bio: {age} {playerObj.height} ft - {playerObj.weight} lbs
              </PlayerBioListItem>
              <PlayerBioListItem>Birthdate: {bDayStr}</PlayerBioListItem>
              <PlayerBioListItem>
                Birthplace: {playerObj.birthCity},
                {playerObj.birthStateProvince &&
                  ` ${playerObj.birthStateProvince}, `}{' '}
                {playerObj.birthCountry}
              </PlayerBioListItem>
              <PlayerBioListItem>
                Player game log ▶
                <IconButton
                  children={<TableChart />}
                  style={{ padding: '0', marginLeft: '0.5rem' }}
                  onClick={() => openPlayerModal('gameLogModal', userData)}
                />
              </PlayerBioListItem>
            </PlayerBioList>
          </TextContainer>
        </PlayerIdent>
        <ProfileStatTable stats={seasonData.stat} />
        <RemovePlayerButton>
          <IconButton
            children={<Close fontSize="small" />}
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
  openPlayerModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(
  mapStateToProps,
  { removePlayerList, openPlayerModal }
)(PlayerProfiles)
