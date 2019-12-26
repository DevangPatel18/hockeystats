import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  AppBar,
  IconButton,
  Toolbar,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import configure from '../../utils/configLocalforage'
import { closePlayerModal } from '../../actions/statActions'
import { yearFormatter, gameLogTableColumns } from '../../helper/columnLabels'
import {
  getPlayerGameLogData,
  getTeamIntervals,
  getTeamSchedule,
  copyPlayerDataToSchedule,
  getPlayerStatColumns,
  getTableData,
} from './PlayerGameLogHelpers'

const headerStyle = {
  background: '#C0C0C0',
  fontWeight: '800',
  padding: '0 5px',
  color: 'rgba(0,0,0,0.54)',
  cursor: 'pointer',
}

const tableCellStyle = {
  fontSize: '0.65rem',
  padding: '3px 5px',
  borderBottom: '1px solid #D0D0D0',
  borderRight: '1px solid #D0D0D0',
}

const gameLogTableColumnsKeys = gameLogTableColumns.map(gameCol => gameCol.key)

class PlayerGameLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      order: 'asc',
      orderBy: '',
    }

    this._isMounted = false
  }

  async componentDidMount() {
    configure().then(async api => {
      const playerGameLogData = await getPlayerGameLogData(api)
      const teamIntervals = getTeamIntervals(playerGameLogData)
      const teamSchedule = await getTeamSchedule(api, teamIntervals)

      copyPlayerDataToSchedule(teamSchedule, playerGameLogData)

      const playerCols = getPlayerStatColumns()
      const tableData = getTableData(teamSchedule, teamIntervals)

      this.setState({ tableData, playerCols })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  tableRowHeader = index => {
    const { playerCols, order, orderBy } = this.state
    return (
      <TableRow key={`row-${index}`}>
        <TableCell
          style={{
            ...headerStyle,
            ...tableCellStyle,
            paddingLeft: '0.5rem',
          }}
        >
          Rank
        </TableCell>
        {gameLogTableColumns.map(colHeader => (
          <TableCell
            key={`${colHeader.label}-${index}`}
            align="center"
            style={{ ...headerStyle, ...tableCellStyle }}
            sortDirection={orderBy === colHeader.key ? order : false}
          >
            <Tooltip
              title={colHeader.key}
              placement={'bottom-end'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === colHeader.key}
                direction={order}
                id={colHeader.key}
                onClick={this.handleRequestSort}
                hideSortIcon={true}
              >
                {colHeader.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
        {playerCols.map(statCol => (
          <TableCell
            key={`${statCol.label}-${index}`}
            align="center"
            style={{ ...headerStyle, ...tableCellStyle }}
            sortDirection={orderBy === statCol.key ? order : false}
          >
            <Tooltip
              title={statCol.key}
              placement={'bottom-end'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === statCol.key}
                direction={order}
                id={statCol.key}
                onClick={this.handleRequestSort}
                hideSortIcon={true}
              >
                {statCol.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    )
  }

  handleRequestSort = ({ currentTarget }) => {
    const orderBy = currentTarget.id
    let order = 'desc'

    if (this.state.orderBy === orderBy && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  render() {
    const { closePlayerModal } = this.props
    const { playerObj } = this.props.stats
    const { tableData, playerCols, order, orderBy } = this.state
    const sortSign = order === 'desc' ? -1 : 1

    if (Object.keys(playerObj).length === 0) {
      return null
    }

    let tableDataDisplay = orderBy
      ? tableData.sort((logA, logB) => {
          if (!gameLogTableColumnsKeys.includes(orderBy)) {
            if (!logB.game) {
              return -1
            }
            if (!logA.game && logB.game) {
              return 1
            }
          }
          if (logA[orderBy] === logB[orderBy]) {
            return logA.date > logB.date ? 1 : -1
          }
          return logA[orderBy] > logB[orderBy] ? sortSign : -1 * sortSign
        })
      : tableData

    return (
      <div>
        <AppBar position="static">
          <Toolbar style={{ position: 'relative' }}>
            <IconButton
              color="inherit"
              onClick={() => closePlayerModal('gameLogModal')}
              aria-label="Close"
              style={{ position: 'absolute' }}
            >
              <CloseIcon />
            </IconButton>
            <div style={{ margin: '0 auto' }}>
              {playerObj.playerName} ({yearFormatter(playerObj.seasonId)})
            </div>
          </Toolbar>
        </AppBar>

        <div
          style={{
            overflow: 'auto',
            height: 'calc(100vh - 65px - 2rem)',
            margin: '1rem',
            border: tableDataDisplay.length ? '1px solid' : '',
            textAlign: 'center',
          }}
        >
          {tableDataDisplay.length ? (
            <Table style={{ margin: '0' }}>
              <TableHead>{this.tableRowHeader('header')}</TableHead>
              <TableBody>
                {tableDataDisplay.map((game, i) => (
                  <React.Fragment key={`gameLogRow-${i}`}>
                    {i > 0 && i % 25 === 0 && this.tableRowHeader(i)}
                    <TableRow hover={true}>
                      <TableCell
                        align="center"
                        style={{ ...tableCellStyle, paddingLeft: '0.5rem' }}
                      >
                        {i + 1}
                      </TableCell>
                      {gameLogTableColumns.map(gameCol => (
                        <TableCell
                          align="center"
                          key={`${gameCol.label}-${i}`}
                          style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}
                        >
                          {game[gameCol.key]}
                        </TableCell>
                      ))}
                      {game['game'] ? (
                        playerCols.map(statCol => (
                          <TableCell
                            align="center"
                            key={`${statCol.label}-g${game['game']}`}
                            style={tableCellStyle}
                          >
                            {statCol.format
                              ? statCol.format(game[statCol.key])
                              : game[statCol.key]}
                          </TableCell>
                        ))
                      ) : (
                        <TableCell
                          colSpan={playerCols.length}
                          align="center"
                          style={tableCellStyle}
                        >
                          INACTIVE
                        </TableCell>
                      )}
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CircularProgress />
          )}
        </div>
      </div>
    )
  }
}

PlayerGameLog.propTypes = {
  stats: PropTypes.object.isRequired,
  playerData: PropTypes.object.isRequired,
  closePlayerModal: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  stats: state.stats,
  playerData: state.playerData,
})

export default connect(
  mapStateToProps,
  { closePlayerModal }
)(PlayerGameLog)
