import nookies from 'nookies'

import JSONHighlight from './Highlight/JSON'
import JavaScriptHighlight from './Highlight/JavaScript'
import BFHighlight from './Highlight/Brainfuck'

import Container, { Main, LineNumbers, Background, Svg } from './block.styles'

export type Props = {
  code: string
  lineNumbers?: boolean | undefined
  noCopy?: boolean | undefined
  language?: 'brainfuck' | 'json' | 'javascript' | string
}


const BlockCode = (props: Props) => {
  const $btnCopy_click = () => {
    navigator.clipboard.writeText(props.code)
  }

  const $btnRun_click = () => {
    nookies.set(null, 'from-code', props.code)
    document.location.href = '/from'
  }

  return <Container className={ props.noCopy ? 'noCopy' : '' }>
    {
      props.lineNumbers &&
        <LineNumbers>
          {
            props.code.split('\n').map(($, _) =>
              <li key={ _ }>{ _ + 1 }</li>
            )
          }
        </LineNumbers>
    }

    <Main>
      {
        props.language === 'brainfuck'  ? <BFHighlight code={ props.code }/>                                     :
        props.language === 'javascript' ? <JavaScriptHighlight code={ props.code }/>                             :
        props.language === 'json'       ? <div dangerouslySetInnerHTML={{ __html: JSONHighlight(props.code) }}/> :
        props.code
      }
    </Main>

    {
      !props.noCopy &&
      <Background className='background'>
        <Svg onClick={ $btnCopy_click } viewBox='0 0 512.000000 512.000000'>
          <g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'>
            <path d='M580 4944 c-195 -51 -355 -212 -405 -409 -13 -51 -15 -235 -15 -1410 0 -1488 -4 -1402 63 -1535 43 -87 150 -194 237 -237 99 -50 166 -63 317 -63 l133 0 0 185 0 185 -102 0 c-57 0 -121 5 -143 11 -51 14 -110 73 -124 124 -15 56 -15 2604 0 2660 14 51 73 110 124 124 56 15 2604 15 2660 0 51 -14 110 -73 124 -124 6 -22 11 -84 11 -137 l0 -98 185 0 185 0 0 128 c0 81 -6 149 -15 187 -51 199 -211 359 -410 410 -87 22 -2740 22 -2825 -1z'/>
            <path d='M1753 3829 c-227 -38 -410 -216 -458 -444 -22 -105 -22 -2665 0 -2770 46 -220 220 -394 440 -440 105 -22 2665 -22 2770 0 221 46 394 219 440 440 22 105 22 2665 0 2770 -42 199 -187 360 -385 428 l-65 22 -1345 1 c-740 1 -1368 -2 -1397 -7z m2725 -388 c42 -22 63 -43 86 -88 14 -29 16 -155 16 -1353 0 -1198 -2 -1324 -16 -1353 -23 -45 -44 -66 -86 -88 -36 -18 -82 -19 -1358 -19 -1198 0 -1324 2 -1353 16 -45 23 -66 44 -88 86 -18 36 -19 82 -19 1358 0 1276 1 1322 19 1358 21 41 42 62 86 85 27 15 165 16 1353 17 1279 0 1324 -1 1360 -19z'/>
          </g>
        </Svg>

        {
          props.language === 'brainfuck' &&
          <Svg onClick={ $btnRun_click } viewBox='0 0 512.000000 512.000000'>
            <g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'>
              <path d='M675 5107 c-154 -41 -273 -155 -327 -316 l-23 -66 -3 -2125 c-2 -1425 1 -2147 8 -2192 21 -136 76 -240 167 -314 78 -64 149 -87 263 -88 167 -2 107 -33 1100 575 327 201 1069 655 1649 1009 1171 716 1167 713 1236 854 20 39 41 99 47 133 31 169 -65 361 -234 471 -35 22 -666 383 -1403 802 -737 420 -1439 819 -1560 888 -121 69 -302 171 -402 228 -100 57 -210 113 -245 125 -77 26 -204 33 -273 16z m138 -441 c53 -22 3501 -1987 3521 -2006 18 -18 18 -19 -6 -40 -26 -22 -3443 -2116 -3510 -2151 -21 -10 -40 -19 -43 -19 -3 0 -5 952 -5 2115 0 1163 2 2115 5 2115 3 0 20 -6 38 -14z'/>
            </g>
          </Svg>
        }
      </Background>
    }
  </Container>
}


export default BlockCode