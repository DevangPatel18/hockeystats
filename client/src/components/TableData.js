import React from 'react'
import PropTypes from 'prop-types'
import {
  TableHead,
  Checkbox,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
} from '@material-ui/core'
import { Star, StarBorder, TableChart } from '@material-ui/icons'
import { amber, grey } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles'
import {
  yearFormatter,
  stopPropagation,
  stableSort,
  getSorting,
  generateCols,
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
    handlePlayerLogModal,
  } = props

  const aggregateTable = !(dataDisplay[0]
    ? Object.keys(dataDisplay[0]).includes('seasonId')
    : false)

  const columns = generateCols(dataDisplay)

  const favCheck = (playerId, seasonId, favList) =>
    favList.some(obj => obj.playerId === playerId && obj.seasonId === seasonId)

  return (
    <>
      <TableHead>
        <TableRow style={{ borderColor: 'none', height: '35px' }}>
          <TableCell
            style={{
              background: '#6d6d6d',
            }}
          />
          <TableCell
            component="th"
            style={{
              paddingLeft: '24px',
              color: 'white',
              fontWeight: 'bolder',
              letterSpacing: '1px',
              background: '#6d6d6d',
            }}
            sortDirection={orderBy === columns[0].id ? order : false}
          >
            Name
          </TableCell>
          {columns.map(col => (
            <TableCell
              align="center"
              key={col.title}
              style={{
                color: 'white',
                whiteSpace: 'nowrap',
                fontWeight: 'bolder',
                letterSpacing: '1px',
                background: '#6d6d6d',
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
                  hideSortIcon={true}
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
              hover={true}
              selected={
                selectedPlayers.includes(
                  [row.playerId, row.seasonId, row.playerTeamsPlayedFor].join(
                    '-'
                  )
                ) || selectedPlayers.includes(row.playerId.toString())
              }
              onClick={event => {
                const tagEntry = aggregateTable
                  ? `${row.playerId}`
                  : `${row.playerId}-${row.seasonId}-${
                      row.playerTeamsPlayedFor
                    }`
                return handleRowClick(event, tagEntry)
              }}
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
                {row['playerName']}
              </TableCell>
              {!aggregateTable && (
                <>
                  <TableCell
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {yearFormatter(row['seasonId'])}
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      icon={<StarBorder />}
                      checkedIcon={<Star />}
                      checked={favCheck(
                        row.playerId,
                        row.seasonId,
                        trackedPlayers
                      )}
                      onChange={() =>
                        updateTrackedPlayers(row.playerId, row.seasonId)
                      }
                      onClick={stopPropagation}
                      style={{ textAlign: 'center' }}
                      classes={{
                        root: classes.root,
                        checked: classes.checked,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      children={<TableChart />}
                      classes={{ root: classes.root }}
                      onClick={event => handlePlayerLogModal(event, row)}
                    />
                  </TableCell>
                </>
              )}
              {columns
                .filter(
                  obj => !['seasonId', 'track', 'gameLogs'].includes(obj.id)
                )
                .map(col => (
                  <TableCell
                    key={`${row.playerId}-${col.title}`}
                    style={{ whiteSpace: 'nowrap', padding: '3px 12px' }}
                    align="center"
                  >
                    {col.format && row[col.id]
                      ? col.format(row[col.id])
                      : row[col.id]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </>
  )
}

TableData.propTypes = {
  dataDisplay: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  rowsPerPage: PropTypes.number.isRequired,
  trackedPlayers: PropTypes.array.isRequired,
  selectedPlayers: PropTypes.array.isRequired,
  isAggregate: PropTypes.bool.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  updateTrackedPlayers: PropTypes.func.isRequired,
  handleRequestSort: PropTypes.func.isRequired,
  handlePlayerLogModal: PropTypes.func.isRequired,
}

export default withStyles(styles)(TableData)
