import React from 'react'

import Line, { Symbol, String, Numbers, MathChars, Commands, Classes, ObjAttr, Function } from './index.styles'

type Props = {
  code?: string
}


const JavaScript = (props: Props) => {
  const colors = {
    symbols: '()[]{}:;,|$',
    strings: `\`'"`,
    stringIgnore: '\\',
    putSepareted: '\t ',
    numbers: '0123456789',
    mathChars: '+-*/?<>.=&',
    commands: [ 'for', 'let', 'const', 'if', 'else', 'throw', 'while', 'do', 'return', 'function' ],
    classes: [ 'String', 'module' ],
    interpolation: {
      begin: '${',
      end: '}'
    }
  }

  let InsideString = { begin: '', inInterpolation: false, is: false, ignoreEnd: false }
  const parts: string[][] = []

  props.code?.split('\n').forEach(($1, _) => {
    const line = [ '' ]

    $1.split('').forEach(($, _) => {
      if (InsideString.is && InsideString.ignoreEnd)
        return line[line.length - 1] += $

      if (InsideString.is && $ === colors.stringIgnore)
        InsideString.ignoreEnd = true

      if (colors.strings.includes($)) {
        if (InsideString.is) {
          if ($ === InsideString.begin) InsideString.is = false
        }
        else {
          InsideString.begin = $
          InsideString.is = true
        }
      }

      if ($1.substring(_, _ + colors.interpolation.begin.length) === colors.interpolation.begin) {
        InsideString.inInterpolation = true
        line.push('')
      }

      if ((InsideString.is || $ === InsideString.begin) && !InsideString.inInterpolation) {
        line[line.length - 1] += $

        if ($ === InsideString.begin)
          line.push('')
      }
      else {
        if (
          colors.putSepareted.includes($) ||
          colors.numbers.includes($) ||
          colors.mathChars.includes($)
        ) {
          if (line[line.length - 1] === '')
            line[line.length - 1] += $
          else
            line.push($)
          line.push('')
        }
        else {
          if (colors.symbols.includes($)) {
            if (line[line.length - 1] === '')
              line[line.length - 1] += $
            else
              line.push($)
            line.push('')
          }
          else
            line[line.length - 1] += $
        }
      }

      if ($1.substring(_, _ + colors.interpolation.end.length) === colors.interpolation.end) {
        InsideString.inInterpolation = false
        line.push('')
      }
    })

    parts.push(line)
  })

  const loopLineHightlight = (line: string[]) => {
    return line.map(($, _) =>
      colors.symbols.includes($) ? <Symbol key={ _ }>{ $ }</Symbol> :
      colors.putSepareted.includes($) ?
        $ === ' ' ? <label key={ _ }>&nbsp;</label> :
        $ === '\t' ? <label key={ _ }>&nbsp;&nbsp;</label> :
        $
      :
      colors.numbers.includes($) ? <Numbers key={ _ }>{ $ }</Numbers> :
      colors.mathChars.includes($) ? <MathChars key={ _ }>{ $ }</MathChars> :
      colors.commands.includes($) ? <Commands key={ _ }>{ $ }</Commands> :
      colors.classes.includes($) ? <Classes key={ _ }>{ $ }</Classes> :
      line[(line.length >= _ + 1 ? _ : 1) + 1] === '(' ? <Function key={ _ }>{ $ }</Function> :
      line[(_ === 0 ? 1 : _) - 1] === '.' ? <ObjAttr key={ _ }>{ $ }</ObjAttr> :
      colors.strings.includes($.substring(0, 1)) ||
      colors.strings.includes($.substring($.length - 1)) ? <String key={ _ }>{ $ }</String> :
      $
    )
  }

  return <>
    {
      parts.map(($, _) =>
        <Line key={ _ }>
          { loopLineHightlight($) }
          <br/>
        </Line>
      )
    }
  </>
}


export default JavaScript