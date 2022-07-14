import { useEffect, useState } from 'react'
import { Label, FormGroup } from 'reactstrap'
import nookies from 'nookies'

import FromBrainfuck from '../scripts/FromBrainfuck'
import FadeButton from '../components/FadeButton'
import Button from '../components/Button'
import FadeTitle from '../components/FadeTitle'
import CodeComponent from '../components/Code/block'
import Input from '../components/Input.styles'
import Memory from '../components/Memory'
import Editor from '../components/Editor'
import Range from '../components/Range'

import { Header, FooterCharTable, Footer, Main, MemoryHeader, ResultPanel, Hero, HeroBackground } from '../styles/from.styles'

type Result = {
  memory: number[]
  pointer: number
  result: string
  index: number
  char: string
  loops: any[]
  error: string
  warning: string
  warnings: {
    index: number
    warning: string
  }[]
}

type CodeType = {
  edited: boolean
  code: string
  warnings: number[]
}


const From = () => {
  const [ Code, SetCode ] = useState<CodeType>({
    edited: false,
    code: nookies.get()['from-code'] || '++++++++\n[\n  > ++++++++++\n  < -\n]\n> . P 80\n\n+++++++++++++++++ . a 97\n+++++++++++++ . n 110\n---------- . d 100\n--- . a 97\n!\n',
    warnings: []
  })

  const [ PauseInterpreter, SetPauseInterpreter ] = useState(true)
  const [ MaxMemory, SetMaxMemory ] = useState<number | null>(null)
  const [ Result, SetResult ] = useState({} as Result)
  const [ Speed, SetSpeed ] = useState(30)
  const [ Warn, SetWarn ] = useState(true)

  const [ Interpreter, SetInterpreter ] = useState<Generator | null>(null)
  const [ State, SetState ] = useState<'stopped' | 'executing' | 'stepped' | 'paused'>('stopped')
  let Timer = {} as NodeJS.Timeout

  function fillArray(length: number, startBy: number = 0) {
    const res = []

    for (let x = startBy; x <= length; x++)
      res.push(null)

    return res
  }

  function interpreterNext() {
    const response = Interpreter?.next() as { value: Result, done: boolean }

    if (response.value) {
      SetResult(response.value)
      SetCode({
        ...Code,
        edited: false,
        warnings: response?.value?.warnings?.map($ => $.index)
      })
    }

    if (response.done) {
      SetState('stopped')
      SetInterpreter(null)
      clearInterval(Timer)
    }
    else if (State === 'stepped')
      Interpreter?.next()
  }

  function startTimer() {
    Timer = setInterval(interpreterNext, Speed)
  }

  function startInterpreter() {
    SetCode({ ...Code, edited: false, warnings: [] })

    SetInterpreter(
      FromBrainfuck(
        Code.code,
        State === 'stepped' || PauseInterpreter,
        Warn,
        undefined,
        MaxMemory || undefined
      )
    )
  }


  const $btnStop_click = () => {
    SetState('stopped')
    SetInterpreter(null)
    clearInterval(Timer)
    SetResult({} as Result)
  }

  const $btnExecute_click = () => {
    startInterpreter()
    SetState('executing')
  }

  const $btnPause_click = () => {
    SetState('paused')
    clearInterval(Timer)
  }

  const $btnContinue_click = () => {
    SetState('executing')
    startTimer()
  }

  const $btnStep_click = () => {
    clearInterval(Timer)

    if (Interpreter === null)
      startInterpreter()
    else
      interpreterNext()

    SetState('stepped')
  }

  const $btnReset_click = () => {
    SetPauseInterpreter(true)
    SetMaxMemory(null)
    SetResult({} as Result)
    SetSpeed(30)
    SetWarn(true)
  }

  window.onbeforeunload = () => {
    nookies.set(null, 'from-code', Code.code)
  }

  useEffect(() => {
    if (State === 'executing')
      startTimer()

    if (State === 'stepped')
      interpreterNext()

  }, [ State ])

  document.title = 'Brainfuck.org | From'

  return <>
    <Hero>
      <HeroBackground/>
    </Hero>

    <Header>
      <div>
        {
          State === 'stopped' &&
          <>
            <Button color='success' className='mini' onClick={ $btnExecute_click }>Execute</Button>
            <Button color='success' className='mini' onClick={ $btnStep_click }>Step</Button>
            <Button color='primary' outline className='mini' onClick={ $btnReset_click }>Reset</Button>
          </>
        }
        {
          State === 'executing' &&
          <>
            <Button color='error' className='mini' onClick={ $btnStop_click }>Stop</Button>
            <Button color='error' outline className='mini' onClick={ $btnPause_click }>Pause</Button>
          </>
        }
        {
          (State === 'paused' || State === 'stepped') &&
          <>
            <Button color='error' className='mini' onClick={ $btnStop_click }>Stop</Button>
            <Button color='success' className='mini' onClick={ $btnStep_click }>Step</Button>
            <Button color='success' outline className='mini' onClick={ $btnContinue_click }>Continue</Button>
          </>
        }
      </div>

      <div>
        <div>
          <label>Velocity:</label>
          <Range
            value={ Speed }
            className='range'
            onSlide={ _value => SetSpeed(_value) }
          />
        </div>

        <div>
          <label>Vectors:</label>
          <Input
            type='number'
            placeholder='auto'
            min={ 0 }
            value={ MaxMemory || '' }
            onChange={ ($: any) => SetMaxMemory(Number($.currentTarget.value)) }
          />
        </div>

        <FormGroup check inline>
          <Input
            type='checkbox'
            defaultChecked={ PauseInterpreter }
            onChange={ ($: any) => SetPauseInterpreter($.currentTarget.checked) }
          />
          <Label check>Pause</Label>
        </FormGroup>

        <FormGroup check inline>
          <Input
            type='checkbox'
            defaultChecked={ Warn }
            onChange={ ($: any) => SetWarn($.currentTarget.checked) }
          />
          <Label check>Warn</Label>
        </FormGroup>
      </div>
    </Header>

    <Main>
      <MemoryHeader>
        <Memory items={Result?.memory || [ 0, 0, 0 ]} max={ MaxMemory || undefined } pointer={ Result?.pointer }/>
        <p>{ Result?.error ?? '' }</p>
      </MemoryHeader>

      <Editor
        State={ State }
        SetCode={ SetCode }
        Result={ Result }
        Code={ Code }
        $btnContinue_click={ $btnContinue_click }
        $btnStop_click={ $btnStop_click }
      />

      {
        Result.index > 0 &&
        <ResultPanel>
          <FadeButton text='JSON Response'>
            <CodeComponent language='json' code={ JSON.stringify(Result) }/>
          </FadeButton>

          <label>Result: { Result ? Result.result : '' }</label>
          <Button onClick={ () => navigator.clipboard.writeText(Result?.result) } color='primary' outline className='mini'>Copy</Button>
        </ResultPanel>
      }
    </Main>

    <Footer>
      <FadeTitle text='ASCII Table'>
        <FooterCharTable>
          {
            fillArray(255, 1).map(($, _) =>
              <li key={ _ }>
                <span>{ _ + 1 }</span>
                <label>{ `: ${String.fromCharCode(_ + 1)}` }</label>
              </li>
            )
          }
        </FooterCharTable>
      </FadeTitle>
    </Footer>
  </>
}


export default From