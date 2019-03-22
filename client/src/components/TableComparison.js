import React from 'react'
import { yearFormatter } from '../helper/columnLabels'
import { generateCols } from '../helper/columnLabels'
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core'

const cellBackground = (obj, i) => {
  if (obj.max.includes(i)) {
    return { color: 'red', fontWeight: 'bolder' }
  } else if (obj.min.includes(i)) {
    return { color: 'blue', fontWeight: 'bolder' }
  }
  return {}
}

const TableComparison = ({ players, data }) => {
  let playersObj = players.map(playerStr => {
    const [playerId, seasonId] = playerStr.split('-')
    const playerObj = data.find(
      obj =>
        obj.playerId === parseInt(playerId) &&
        (!seasonId || obj.seasonId === parseInt(seasonId))
    )

    if (!playerObj) return null

    let newplayerObj
    if (seasonId) {
      newplayerObj = {
        ...playerObj,
        seasonId: yearFormatter(playerObj.seasonId),
      }
    } else {
      newplayerObj = { ...playerObj }
    }

    return newplayerObj
  })

  playersObj = playersObj.filter(x => x)
  if (!playersObj.length)
    return (
      <div style={{ padding: '2rem' }}>Please select rows for comparison</div>
    )

  let columnsMin = generateCols(playersObj)

  columnsMin = columnsMin.filter(obj => obj.id !== 'track')
  columnsMin.unshift({ title: 'Name', id: 'playerName' })

  let minMax = {}

  if (playersObj.length > 1) {
    columnsMin.forEach(attr => {
      const dataVal = playersObj[0][attr.id]
      if (typeof dataVal === 'number') {
        const attrArray = playersObj.map(obj => obj[attr.id])
        const max = Math.max(...attrArray)
        const min = Math.min(...attrArray)
        const maxArray = []
        const minArray = []

        if (min !== max) {
          attrArray.forEach((val, i) => {
            if (val === max) {
              maxArray.push(i)
            }
            if (val === min) {
              minArray.push(i)
            }
          })
          minMax[attr.id] = { max: maxArray, min: minArray }
        }
      }
    })
  }

  return (
    <Table padding="checkbox">
      <TableBody>
        <TableRow>
          <TableCell />
          {playersObj.map(obj => (
            <TableCell key={`${obj.playerId}-${obj.seasonId}-img`}>
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
        {columnsMin
          .filter(
            colObj =>
              playersObj[0].seasonId ||
              !['seasonId', 'playerTeamsPlayedFor'].includes(colObj.id)
          )
          .map(colObj => (
            <TableRow key={colObj.title} style={{ height: '27px' }}>
              <TableCell style={{ fontWeight: 'bolder', paddingLeft: '10px' }}>
                {colObj.title}
              </TableCell>
              {playersObj.map((obj, i) => (
                <TableCell
                  align="center"
                  key={`${obj.playerId}-${obj.seasonId}-${colObj.id}`}
                  style={
                    minMax[colObj.id]
                      ? cellBackground(minMax[colObj.id], i)
                      : {}
                  }
                >
                  {colObj.format
                    ? colObj.format(obj[colObj.id])
                    : obj[colObj.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default TableComparison