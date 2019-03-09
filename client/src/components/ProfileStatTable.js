import React from 'react'
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import { ProfileSkateCol } from '../helper/columnLabels'

const ProfileStatTable = ({ stats }) => (
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
          {ProfileSkateCol.map(obj => (
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
          {ProfileSkateCol.map(obj => (
            <TableCell align="center" key={obj.key}>
              {stats[obj.key]}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </Paper>
)

export default ProfileStatTable
