import styled from 'styled-components'
import { NavItem as NavItemC } from 'reactstrap'


export const Title = styled.h1`
  margin: 0;

  font-family: 'Alpha centauri';
`

export const NavItem = styled(NavItemC)`
  position: relative;

  overflow: hidden;

  &.selected {
    opacity: .8;
    transition: opacity .2s;

    a {
      color: var(--secondary-cl) !important;
    }

    &:hover {
      opacity: 1;
    }

    &::after {
      background-color: var(--secondary-cl) !important;
    }
  }

  &.selected::after,
  &:hover::after {
    content: '';
    display: block;
    position: absolute;

    top: calc(100% - 3px);
    left: 15%;

    height: 6px;
    width: 70%;

    border-radius: 4px;
    background-color: var(--primary-font-cl);
  }
`
