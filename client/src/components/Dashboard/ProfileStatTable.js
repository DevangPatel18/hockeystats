import React from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
} from '@material-ui/core'
import { TableCellStyled as TableCell } from '../styles/TableStyles'
import { ProfileSkateCol, ProfileGoalieCol } from '../../helper/columnLabels'

const ProfileStatTable = ({ stats }) => {
  const keyCols = stats.wins ? ProfileGoalieCol : ProfileSkateCol
  return (
    <Paper
      style={{
        overflowX: 'auto',
        paddingLeft: '1rem',
        margin: '1rem',
      }}
    >
      <Table>
        <TableHead>
          <TableRow style={{ height: '2rem' }}>
            {keyCols.map(obj => (
              <TableCell
                align="center"
                key={obj.label}
                style={{ fontWeight: 'bolder' }}
              >
                <Tooltip
                  title={obj.key}
                  placement={'bottom-end'}
                  enterDelay={300}
                >
                  <span>{obj.label}</span>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={{ height: 'auto' }}>
            {keyCols.map(obj => (
              <TableCell align="center" key={obj.key}>
                {obj.format ? obj.format(stats[obj.key]) : stats[obj.key]}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

ProfileStatTable.propTypes = {
  stats: PropTypes.object.isRequired,
}

export default ProfileStatTable
