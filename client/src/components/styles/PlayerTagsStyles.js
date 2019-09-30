import styled from 'styled-components'

export const PlayerTagContainerStyles = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
  height: 73px;
`

export const PlayerTagStyles = styled.div`
  background: ${props =>
    `linear-gradient(${props.colors.first} 60%, ${props.colors.second})`};
  color: white;
  margin: 0.5rem 1rem 0.5rem 0;
  border-radius: 1.5rem;
  padding: 0.4rem 0.75rem;
  height: 38px;
  line-height: ${props => (props.seasonId ? '12px' : '')};
  display: flex;
  flex-direction: column;
  font-family: Lato, sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 1px 1px gray;

  &:hover {
    box-shadow: 0 3px 6px gray;
    transform: translateY(-3px);
  }
`

export const PlayerTagNameStyles = styled.span`
  font-size: 0.75rem;
  font-weight: bolder;
  white-space: nowrap;
`

export const PlayerTagYearStyles = styled.span`
  width: 100%;
  font-size: 0.6rem;
  text-align: right;
`
