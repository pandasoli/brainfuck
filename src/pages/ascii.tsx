import { useState } from 'react'

import Input from '../components/Input.styles'

import { FooterCharTable, Convertions, ResultLabel } from '../styles/ascii.styles'


const ASCII = () => {
  const [ ConvertionsResult, SetConvertionsResult ] = useState({ to: 80, from: 'P' })

  function fillArray(length: number, startBy: number = 0) {
    const res = []

    for (let x = startBy; x <= length; x++)
      res.push(null)

    return res
  }

  const $txbConvertions_change = ($: any) => {
    const element = $.currentTarget

    if (element.name === 'to')
      SetConvertionsResult({
        ...ConvertionsResult,
        to: element.value === '' ? 80 : element.value.charCodeAt(0)
      })
    else if (element.name === 'from')
      SetConvertionsResult({
        ...ConvertionsResult,
        from: element.value === '' ? 'P' : String.fromCharCode(element.value)
      })
  }

  document.title = 'Brainfuck.org | ASCII'

  return <>
    <h2>Convertion</h2>

    <Convertions>
      <div>
        <label>ASCII to character:</label>
        <Input
          name='from'
          type='number'
          placeholder='80'
          min={ 0 }
          max={ 255 }
          onChange={ $txbConvertions_change }
        />
        <ResultLabel>Result: { ConvertionsResult.from }</ResultLabel>
      </div>

      <div>
        <label>Character to ASCII:</label>
        <Input
          name='to'
          type='text'
          placeholder='P'
          maxLength={ 1 }
          onChange={ $txbConvertions_change }
        />
        <ResultLabel>Result: { ConvertionsResult.to }</ResultLabel>
      </div>
    </Convertions>


    <h2>What accepted by brainfuck</h2>

    <FooterCharTable>
      {
        fillArray(255).map(($, _) =>
          <li key={ _ }>
            <span>{ _ }</span>
            <label>{ `: ${String.fromCharCode(_)}` }</label>
          </li>
        )
      }
    </FooterCharTable>
  </>
}


export default ASCII