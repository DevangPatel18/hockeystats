import React from 'react'
import {
  TableHead,
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import { columns, yearFormatter } from '../helper/columnLabels'

const stopPropagation = event => {
  event.stopPropagation()
}

const TableData = props => {
  const {
    dataDisplay,
    page,
    rowsPerPage,
    trackedPlayers,
    selectedPlayers,
    handleRowClick,
    updateTrackedPlayers,
  } = props
  return (
    <>
      <TableHead>
        <TableRow style={{ borderColor: 'none' }}>
          <TableCell
            component="th"
            style={{
              paddingLeft: '24px',
              color: 'white',
              background: '#000000',
              background: 'linear-gradient(to top, #434343, #000000)',
            }}
          >
            {columns[0].title}
          </TableCell>
          {columns.slice(1).map(col => (
            <TableCell
              align="center"
              key={col.title}
              style={{
                color: 'white',
                whiteSpace: 'nowrap',
                background: '#000000',
                background: 'linear-gradient(to top, #434343, #000000)',
              }}
            >
              {col.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {dataDisplay
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map(row => (
            <TableRow
              key={`${row.playerId}-${row.seasonId}`}
              style={{ height: 'auto' }}
              selected={selectedPlayers.includes(
                [row.playerId, row.seasonId].join('-')
              )}
              onClick={event =>
                handleRowClick(event, [row.playerId, row.seasonId].join('-'))
              }
            >
              <TableCell
                component="th"
                style={{
                  paddingLeft: '24px',
                  whiteSpace: 'nowrap',
                  width: '300px',
                }}
              >
                {row[columns[0].id]}
              </TableCell>
              <TableCell
                style={{
                  paddingLeft: '24px',
                  whiteSpace: 'nowrap',
                  width: '300px',
                }}
              >
                {yearFormatter(row[columns[1].id])}
              </TableCell>
              {columns.slice(2).map(col => (
                <TableCell
                  key={`${row.playerId}-${col.title}`}
                  style={{ whiteSpace: 'nowrap', padding: '3px 12px' }}
                  align="center"
                >
                  {row[col.id]}
                  {col.id === 'track' && (
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      checked={trackedPlayers.includes(row.playerId)}
                      onChange={() =>
                        updateTrackedPlayers(row.playerId, row.seasonId)
                      }
                      onClick={stopPropagation}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </>
  )
}

export default TableData
