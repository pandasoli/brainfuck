import styled from 'styled-components'
import PC from '../components/Paragraph.styles'


export const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;

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

export const HeroHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  z-index: 1;
`

export const HeroTitle = styled.h1`
  margin-bottom: 20px;

  font-size: min(var(--header-0), 15vw);
  font-family: 'Alpha centauri';

  z-index: 1;
`

export const HeroMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-bottom: 30px;
  padding-top: 20px;

  z-index: 1;

  .btn {
    margin: 6px;
  }
`

export const Main = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 100%;

  padding: 20px 20px 0px 20px;

  .btn {
    margin-top: 40px;
  }
`

export const P = styled(PC)`
  max-width: 768px;
`
