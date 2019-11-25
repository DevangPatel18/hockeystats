import { FormControl, Chip } from '@material-ui/core'
import styled from 'styled-components'

const tabletWidth = '425px'
const mobileWidth = '900px'

export const StatsPanel = styled.div`
  position: relative;
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  margin: 1rem 0;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media (max-width: ${mobileWidth}) {
    justify-content: space-evenly;
  }

  &::before {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -1.8rem);
    padding: 0 4px;
    background: white;
    font-weight: 600;
    font-size: 0.8rem;
    color: #757575;
    content: ${props =>
      props.title
        ? `
    '${props.title}'
    `
        : ''};
  }
`

export const FormControlStyles = styled(FormControl)`
  && {
    margin-right: 1rem;
  }

  svg {
    display: none;
  }
`

export const YearRange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;

  @media (max-width: ${mobileWidth}) {
    flex-wrap: wrap;
  }
`

export const YearRangeLabel = styled.div`
  padding-right: 1rem;
  font-weight: bolder;
  font-size: 0.8rem;

  @media (max-width: ${tabletWidth}) {
    padding: 0 0 0.5rem;
  }
`

export const ChipStyles = styled(Chip)`
  margin: 0 0.15rem;
`
