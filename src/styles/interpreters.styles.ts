import styled from 'styled-components'


export const Hero = styled.div`
  position: absolute;

  width: 100%;
  height: 76vh;

  z-index: -1;
  background-image: url('/images/background.jpg');
  background-position: 50%;
  background-size: cover;
  background-attachment: fixed;
`

export const HeroBackground = styled.div`
  position: absolute;

  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, .6);

  z-index: 0;
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
`
