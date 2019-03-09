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
  let keyCols, playerData
  if (stats.wins) {
    keyCols = ProfileGoalieCol
    playerData = {
      ...stats,
      powerPlaySavePercentage: (stats.powerPlaySavePercentage / 100).toFixed(3),
      shortHandedSavePercentage: (
        stats.shortHandedSavePercentage / 100
      ).toFixed(3),
      evenStrengthSavePercentage: (
        stats.evenStrengthSavePercentage / 100
      ).toFixed(3),
    }
  } else {
    keyCols = ProfileSkateCol
    playerData = stats
  }
  return (
    <Paper
      style={{
        overflowX: 'auto',
        width: '700px',
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
                {playerData[obj.key]}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

export default ProfileStatTable
