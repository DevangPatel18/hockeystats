import React from 'react'
import PlayerProfiles from './PlayerProfiles'

const DashboardProfiles = ({ trackedPlayerData }) => {
  const { skaters, goalies } = trackedPlayerData.reduce(
    (splitArr, playerObj) => {
      splitArr[
        playerObj.primaryPosition.code === 'G' ? 'goalies' : 'skaters'
      ].push(playerObj)
      return splitArr
    },
    { skaters: [], goalies: [] }
  )
  return (
    <>
      {skaters.length > 0 && (
        <>
          <h3>Skaters</h3>
          <PlayerProfiles players={skaters} />
        </>
      )}
      {goalies.length > 0 && (
        <>
          <h3>Goalies</h3>
          <PlayerProfiles players={goalies} />
        </>
      )}
    </>
  )
}

export default DashboardProfiles
