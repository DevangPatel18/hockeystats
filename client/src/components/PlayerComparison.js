import React from 'react'
import { yearFormatter } from '../helper/columnLabels'
import { columns } from '../helper/columnLabels'
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'

const columnsMin = columns.slice()
// Remove Track field
const trackIdx = columnsMin.findIndex(obj => obj.title === 'Track')
columnsMin.splice(trackIdx, 1)

const PlayerComparison = ({ players, data }) => {
  console.log(trackIdx)
  const playersObj = players.map(playerStr => {
    const [playerId, seasonId] = playerStr.split('-')
    const playerObj = data.find(
      obj =>
        obj.playerId === parseInt(playerId) &&
        obj.seasonId === parseInt(seasonId)
    )

    const newplayerObj = {
      ...playerObj,
      seasonId: yearFormatter(playerObj.seasonId),
    }

    return newplayerObj
  })

  console.log(playersObj)
  return (
    <Table padding="checkbox">
      <TableBody>
        <TableRow>
          <TableCell />
          {playersObj.map(obj => (
            <TableCell key={obj.playerId}>
              <img
                src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${
                  obj.playerId
                }.jpg`}
                alt={obj.playerName}
                style={{
                  margin: '5px',
                  borderRadius: '50%',
                  width: '120px',
                  boxShadow: '0 0 5px black',
                }}
              />
            </TableCell>
          ))}
        </TableRow>
        {columnsMin.map(colObj => (
          <TableRow key={colObj.title} style={{ height: '27px' }}>
            <TableCell style={{ fontWeight: 'bolder', paddingLeft: '10px' }}>
              {colObj.title}
            </TableCell>
            {playersObj.map(obj => (
              <TableCell align="center" key={`${obj.playerId}-${colObj.id}`}>
                {obj[colObj.id]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PlayerComparison
