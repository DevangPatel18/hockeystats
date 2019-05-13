import React from 'react'
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import { ProfileSkateCol, ProfileGoalieCol } from '../helper/columnLabels'

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
      <Table padding="checkbox">
        <TableHead>
          <TableRow style={{ height: '2rem' }}>
            {keyCols.map(obj => (
              <TableCell
                align="center"
                key={obj.label}
                style={{ fontWeight: 'bolder' }}
              >
                {obj.label}
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

export default ProfileStatTable
