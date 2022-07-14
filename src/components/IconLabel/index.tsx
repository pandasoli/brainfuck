import Container, { Icon } from './index.styles'

type Props = {
  icon: 'github' | 'facebook' | 'instagram'
  text: string
  link?: string
}


const IconLabel = (props: Props) =>
  <Container>
    <Icon src={ `/svgs/${props.icon}.svg` } alt={ props.icon + ' icon not found at /svgs/' }/>
    <a href={ props.link }>{ props.text }</a>
  </Container>


export default IconLabel