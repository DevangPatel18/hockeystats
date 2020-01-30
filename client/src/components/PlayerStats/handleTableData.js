import React from 'react'
import { TablePagination, Paper, LinearProgress } from '@material-ui/core'
import TablePaginationActions from './TablePaginationActions'
import TableData from './TableData'

export default function(dataDisplay) {
  const { selectedPlayers } = this.state
  const { rowsPerPage, page } = this.props.tableSettings
  const { dataLoad, trackedPlayers } = this.props.stats
  const { total } = this.props.playerData

  return (
    <>
      <LinearProgress
        color="secondary"
        style={{
          opacity: dataLoad ? '1' : '0',
          transition: 'all 0.5s',
          marginBottom: '-3px',
        }}
      />
      <Paper>
        <div
          style={{
            position: 'absolute',
            width: 'calc(100% - 2rem)',
            height: `calc(156px + ${rowsPerPage * 33}px)`,
            background: 'white',
            opacity: dataLoad ? '0.5' : '0',
            zIndex: dataLoad ? '1' : '-1',
            transition: 'all 0.5s',
          }}
        />
        <TableData
          dataDisplay={dataDisplay}
          page={page}
          rowsPerPage={rowsPerPage}
          selectedPlayers={selectedPlayers}
          trackedPlayers={trackedPlayers}
          handleRowClick={this.handleRowClick}
          updateTrackedPlayers={this.updateTrackedPlayers}
          handleRequestSort={this.handleRequestSort}
          handleStarClick={this.handleStarClick}
        />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            native: true,
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          style={{ overflow: 'auto' }}
        />
      </Paper>
    </>
  )
}
