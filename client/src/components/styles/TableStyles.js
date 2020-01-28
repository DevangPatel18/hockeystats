import { withStyles, TableCell, TableSortLabel } from '@material-ui/core'
import styled from 'styled-components'

export const TableCellStyled = withStyles({
  root: {
    fontSize: '0.8125rem',
    lineHeight: '1.8',
    padding: '0 0.75rem',
  },
})(TableCell)

export const TableSortLabelStyled = styled(TableSortLabel)`
  &&&&& svg {
    color: white;
  }
`
