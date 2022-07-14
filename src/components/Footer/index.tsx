import IconLabel from '../IconLabel'

import Container, { Divider, Title } from './index.styles'


const Footer = () =>
  <Container>
    <Divider>
      <Title>Project repo</Title>

      <a href='https://github.com/pandasoli/brainfuck.org'>GitHub</a>
    </Divider>

    <Divider>
      <Title>Credits</Title>

      <IconLabel icon='github' text='pandasoli' link='https://github.com/pandasoli'/>
      <IconLabel icon='instagram' text='pandasoli.ofc' link='https://instagram.com/pandasoli.ofc'/>
      <IconLabel icon='facebook' text='pandasoli.ofc' link='https://facebook.com/pandasoli.ofc'/>
    </Divider>
  </Container>


export default Footer