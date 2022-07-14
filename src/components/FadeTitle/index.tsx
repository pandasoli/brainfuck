import { ReactNode, useState } from 'react'

import { Svg, Header, Main } from './index.styles'

type Props = {
  text?: string
  children?: ReactNode
}


const FadeTitle = (props: Props) => {
  const [ Open, SetOpen ] = useState(false)

  return <section>
    <Header onClick={ () => SetOpen(!Open) }>
      <h2>{ props.text }</h2>

      <Svg viewBox='0 0 512.000000 512.000000' className={ Open ? 'open' : '' }>
        <g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'>
          <path d='M1455 4786 c-67 -29 -105 -105 -90 -183 6 -34 117 -149 1008 -1040 l1002 -1003 -1002 -1002 c-1089 -1090 -1026 -1021 -1008 -1115 9 -49 69 -109 118 -118 95 -18 18 -88 1189 1083 959 960 1077 1081 1083 1115 18 95 87 18 -1073 1181 -625 625 -1080 1074 -1099 1082 -40 17 -89 17 -128 0z'/>
        </g>
      </Svg>
    </Header>

    <Main>
      { Open && props.children }
    </Main>
  </section>
}


export default FadeTitle