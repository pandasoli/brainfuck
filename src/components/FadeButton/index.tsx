import { ReactNode, useState } from 'react'
import Button from '../Button'

import { Header, Main } from './index.styles'

type Props = {
  text: string
  children: ReactNode
}


const FadeButton = (props: Props) => {
  const [ Open, SetOpen ] = useState(false)

  return <section>
    <Header>
      <Button color='primary' outline onClick={ () => SetOpen(!Open) }>{ props.text }</Button>
    </Header>
    <Main>
      { Open && props.children }
    </Main>
  </section>
}


export default FadeButton