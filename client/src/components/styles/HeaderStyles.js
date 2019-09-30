import styled from 'styled-components'
import { Link } from 'gatsby'

const mobileWidth = '900px'

export const HeaderMain = styled.div`
  background: #333333;
`

export const HeaderContainer = styled.div`
  z-index: 5;
  margin: 0 auto;
  max-width: 960px;
  min-height: 70px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  color: white;
  position: relative;
`

export const HeaderTitle = styled.h1`
  margin: 0 1rem;
  a {
    color: white;
    text-decoration: none;
  }

  @media (max-width: 360px) {
    font-size: 9.6vw;
  }
`

export const HeaderNavList = styled.ul`
  font-family: 'Lato', sans-serif;
  display: flex;
  align-items: center;
  margin: 0;

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
  }
`

export const NavStyled = styled.nav`
  z-index: 4;
  @media (max-width: ${mobileWidth}) {
    position: absolute;
    top: 100%;
    width: 100%;
    background: rgba(68, 68, 68, 0.7);
    overflow: hidden;
    height: ${props => (props.menuOpen ? 'auto' : 0)};
  }
`

export const UserLabelItem = styled.li`
  display: flex;
  position: relative;
  margin: 0;
  padding: 0.3rem 1rem;
  list-style: none;
  cursor: pointer;
  width: auto;

  div {
    display: flex;
    align-items: flex-end;
  }

  &:hover ul {
    height: 99px;
  }

  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 100%;

    &:hover ul {
      height: auto;
    }
  }
`

export const UserNavList = styled.ul`
  display: flex;
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.2s ease;
  width: 120px;
  height: 0;
  flex-direction: column;
  align-items: center;
  margin: 0;
  background: #444444;
  overflow: hidden;

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    background: none;
    position: static;
    height: auto;
    transform: translateX(0%);
  }
`

export const UserNavItems = styled.li`
  list-style: none;
  margin: 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.2rem 1rem;
  width: auto;

  a {
    padding: 0.2rem 2rem;
    width: 100%;
  }

  &:hover {
    background: #4787fe;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    padding: 0;
  }
`

export const HeaderNavItems = styled.li`
  a {
    margin: 0;
    padding: 0.2rem 0.4rem;
  }
  margin: 0 0.5rem;
  list-style: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;

  &:hover {
    background: #4787fe;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    text-align: center;
  }
`

export const LinkStyled = styled(Link)`
  color: white;
  text-decoration: none;
`

export const HamburgerBox = styled.div`
  display: none;
  @media (max-width: ${mobileWidth}) {
    display: block;
  }
`
