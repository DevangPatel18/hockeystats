import { withStyles, TableCell } from '@material-ui/core'

export const TableCellStyled = withStyles({
  root: {
    fontSize: '0.8125rem',
    lineHeight: '1.8',
    padding: '0 0.75rem',
  },
})(TableCell)
