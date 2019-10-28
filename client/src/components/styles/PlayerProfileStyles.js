import styled from 'styled-components'

const mobileWidth = '425px'
const tabletWidth = '800px'

export const ProfileContainer = styled.div`
  box-shadow: 3px 3px 8px lightgray;
  padding-bottom: 0.3rem;
  margin-bottom: 2rem;
  font-size: 1rem;

  @media (max-width: ${mobileWidth}) {
    font-size: 0.85rem;
  }
`

export const PlayerIdent = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 1rem;

  &:before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: '';
    background: ${props => `url(${props.logoUrl}) no-repeat right`};
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    text-align: center;
  }
`

export const ImageContainer = styled.div`
  padding: 1rem 1rem 0;
  text-align: center;
  max-width: 180px;

  @media (max-width: ${mobileWidth}) {
    margin: 0 auto;
    max-width: 120px;
  }
`

export const TextContainer = styled.div`
  position: relative;
  overflow-x: auto;
  margin: 1rem 1rem 0;
`

export const PlayerBioList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`

export const PlayerBioListItem = styled.li`
  flex: 50%;
  margin-bottom: 0.5rem;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 0.1rem;
  }
`

export const RemovePlayerButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem;
  opacity: 1;
  transition: all 0.2s;
  cursor: pointer;
`
