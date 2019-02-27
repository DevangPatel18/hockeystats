import React from 'react'
import {
  TableHead,
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
} from '@material-ui/core'
import { Star, StarBorder } from '@material-ui/icons'
import { amber, grey } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles'
import {
  columns,
  yearFormatter,
  stopPropagation,
  stableSort,
  getSorting,
} from '../helper/columnLabels'
import Tooltip from '@material-ui/core/Tooltip'

const styles = {
  root: {
    color: grey[500],
    '&$checked': {
      color: amber[600],
    },
    padding: 0,
    transform: 'scale(0.8)',
  },
  checked: {},
}

const TableData = props => {
  const {
    dataDisplay,
    page,
    order,
    orderBy,
    rowsPerPage,
    trackedPlayers,
    selectedPlayers,
    handleRowClick,
    updateTrackedPlayers,
    classes,
    handleRequestSort,
  } = props

  const aggregateTable = !(dataDisplay[0]
    ? Object.keys(dataDisplay[0]).includes('seasonId')
    : false)

  return (
    <>
      <TableHead>
        <TableRow style={{ borderColor: 'none' }}>
          <TableCell
            style={{
              background: '#000000',
              background: 'linear-gradient(to top, #434343, #000000)',
            }}
          />
          <TableCell
            component="th"
            style={{
              paddingLeft: '24px',
              color: 'white',
              background: '#000000',
              background: 'linear-gradient(to top, #434343, #000000)',
            }}
            sortDirection={orderBy === columns[0].id ? order : false}
          >
            {columns[0].title}
          </TableCell>
          {columns
            .slice(1)
            .filter(
              colObj =>
                !aggregateTable ||
                !['seasonId', 'track', 'playerTeamsPlayedFor'].includes(
                  colObj.id
                )
            )
            .map(col => (
              <TableCell
                align="center"
                key={col.title}
                style={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  background: '#000000',
                  background: 'linear-gradient(to top, #434343, #000000)',
                }}
                sortDirection={orderBy === col.id ? order : false}
              >
                <Tooltip title="Sort" placement={'bottom-end'} enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={order}
                    onClick={event => handleRequestSort(event, col.id)}
                    style={{
                      color: 'white',
                    }}
                  >
                    {col.title}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {stableSort(dataDisplay, getSorting(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, i) => (
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
                style={{
                  padding: '0 5px',
                  margin: '0',
                }}
              >
                {i + 1 + page * rowsPerPage}
              </TableCell>
              <TableCell
                component="th"
                style={{
                  paddingLeft: '24px',
                  whiteSpace: 'nowrap',
                }}
              >
                {row[columns[0].id]}
              </TableCell>
              {!aggregateTable && (
                <TableCell
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {yearFormatter(row[columns[1].id])}
                </TableCell>
              )}
              {columns
                .slice(2)
                .filter(
                  colObj =>
                    !aggregateTable ||
                    !['seasonId', 'track', 'playerTeamsPlayedFor'].includes(
                      colObj.id
                    )
                )
                .map(col => (
                  <TableCell
                    key={`${row.playerId}-${col.title}`}
                    style={{ whiteSpace: 'nowrap', padding: '3px 12px' }}
                    align="center"
                  >
                    {row[col.id]}
                    {col.id === 'track' && (
                      <Checkbox
                        icon={<StarBorder />}
                        checkedIcon={<Star />}
                        checked={trackedPlayers.includes(row.playerId)}
                        onChange={() =>
                          updateTrackedPlayers(row.playerId, row.seasonId)
                        }
                        onClick={stopPropagation}
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                        }}
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

export default withStyles(styles)(TableData)
