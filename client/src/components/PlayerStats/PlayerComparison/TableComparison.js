import React from 'react'
import PropTypes from 'prop-types'
import { yearFormatter } from '../../../helper/columnLabels'
import { generateCols } from '../../../helper/columnLabels'
import { Table, TableBody, TableRow } from '@material-ui/core'
import { TableCellStyled as TableCell } from '../../../components/styles/TableStyles'
import statsSortedAsc from '../../../helper/statsSortedAsc'

const cellBackground = (obj, i) => {
  if (obj.max.includes(i)) {
    return { color: 'red', fontWeight: 'bolder' }
  } else if (obj.min.includes(i)) {
    return { color: 'blue', fontWeight: 'bolder' }
  }
  return {}
}

const TableComparison = ({ selectedPlayers, data }) => {
  let playersObj = selectedPlayers.map(playerStr => {
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

  let columnsMin = generateCols(playersObj)

  columnsMin = columnsMin.filter(obj => !['track', 'gameLogs'].includes(obj.id))
  columnsMin.unshift({ title: 'Name', id: 'playerName' })

  let minMax = {}

  if (playersObj.length > 1) {
    columnsMin.forEach(attr => {
      const dataVal = playersObj[0][attr.id]
      if (typeof dataVal === 'number') {
        const maxObj = { val: playersObj[0][attr.id], list: [0] }
        const minObj = { val: playersObj[0][attr.id], list: [0] }

        for (let i = 1; i < playersObj.length; i++) {
          if (playersObj[i][attr.id] > maxObj.val) {
            maxObj.val = playersObj[i][attr.id]
            maxObj.list = [i]
          } else if (playersObj[i][attr.id] === maxObj.val) {
            maxObj.list.push(i)
          } else if (playersObj[i][attr.id] === minObj.val) {
            minObj.list.push(i)
          } else if (playersObj[i][attr.id] < minObj.val) {
            minObj.val = playersObj[i][attr.id]
            minObj.list = [i]
          }
        }

        if (maxObj.val !== minObj.val) {
          minMax[attr.id] = statsSortedAsc.includes(attr.id)
            ? { max: minObj.list, min: maxObj.list }
            : { max: maxObj.list, min: minObj.list }
        }
      }
    })
  }

  return (
    <Table
      size="small"
      style={{ width: 'auto', margin: '0 auto', border: '1px solid' }}
    >
      <TableBody>
        <TableRow>
          <TableCell />
          {playersObj.map(obj => (
            <TableCell key={`${obj.playerId}-${obj.seasonId}-img`}>
              <img
                src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${obj.playerId}.jpg`}
                alt={obj.playerName}
                style={{
                  display: 'flex',
                  margin: '1rem',
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
              !['seasonId', 'teamAbbrevs'].includes(colObj.id)
          )
          .map(colObj => (
            <TableRow key={colObj.title} hover={true}>
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
                  {colObj.format && obj[colObj.id]
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

TableComparison.propTypes = {
  selectedPlayers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}

export default TableComparison
