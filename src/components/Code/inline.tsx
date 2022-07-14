import BFHighlight from './Highlight/Brainfuck'
import JavaScriptHighlight from './Highlight/JavaScript'
import JSONHighlight from './Highlight/JSON'

import Container from './inline.styles'

export type Props = {
  code: string
  language?: 'brainfuck' | 'json' | 'javascript' | string
}


const InlineCode = (props: Props) => {
  return <Container>
    {
      props.language === 'brainfuck'  ? <BFHighlight code={ props.code }/>                                     :
      props.language === 'javascript' ? <JavaScriptHighlight code={ props.code }/>                             :
      props.language === 'json'       ? <div dangerouslySetInnerHTML={{ __html: JSONHighlight(props.code) }}/> :
      props.code
    }
  </Container>
}


export default InlineCode