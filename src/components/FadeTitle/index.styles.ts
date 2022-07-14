import styled from 'styled-components'


export const Svg = styled.svg`
  height: 30px;

  margin-left: 10px;

  g path {
    fill: var(--primary-font-cl);
  }

  &.open {
    transform: rotate(90deg);
  }
`

export const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px 60px 0 60px;

  cursor: pointer;
`

export const Main = styled.main`
  width: 100%;
`
