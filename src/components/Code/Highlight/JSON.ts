
function InsertSyntax(_code: string): string {
	if (!_code) return ''

	const details = {
		inString: false,
		indentationSize: '',
		lastDetails: {
			char: '',
			inString: false
		}
	}
	let result = ''

  function colorize(_text: string, _color: string) {
    const colors: { [color: string]: string } = {
      yellow: '#d19a66',
      green: '#98c379',
      red: '#e06c75',
			gray: '#e2e7ef'
    }

    return `<span style='color: ${colors[_color]}'>${_text}</span>`
  }

	function preFormat(_string: string) {
		let inString = false
		let result = ''

		_string.split('').forEach(_char => {
			if (_char === '"') {
				inString = !inString
			}

			if (_char !== ' ' || inString) {
				result += _char
			}

		})

		return result
	}

	function getColored(_char: string) {
		if (details.inString || details.lastDetails.inString) {
			return colorize(_char, 'green')
		}

		if (
			_char === '0' ||
			_char === '1' ||
			_char === '2' ||
			_char === '3' ||
			_char === '4' ||
			_char === '5' ||
			_char === '6' ||
			_char === '7' ||
			_char === '8' ||
			_char === '9'
		) {
			return colorize(_char, 'yellow')
		}

		if (
			_char === '[' || _char === ']' ||
			_char === '{' || _char === '}' ||
			_char === ':' || _char === ','
		) {
			return colorize(_char, 'gray')
		}

		return _char
	}

	function configure(_char: string) {
		if (_char === '"' && details.lastDetails.char !== '\\') {
			details.inString = !details.inString
		}
		else if (!details.inString) {

			if (_char === '{' || _char === '[') {
				details.indentationSize += '&nbsp;&nbsp;'
			}
			else if (_char === '}' || _char === ']') {
				details.indentationSize = details.indentationSize.substring(0, details.indentationSize.length - ('&nbsp;'.length * 2))
			}

		}
	}

	function format(_char: string) {

		if (!details.inString) {
			if (_char === '{' || _char === '[') {
				return `${getColored(_char)}<br/>${details.indentationSize}`
			}
			else if (_char === '}' || _char === ']') {
				return `<br/>${details.indentationSize}${getColored(_char)}`
			}

			if (_char === ':') {
				return `${getColored(':')}&nbsp;`
			}

			if (_char === ',') {
				return `${getColored(',')}<br/>${details.indentationSize}`
			}
		}

		return _char
	}

	preFormat(_code)
  .split('')
  .forEach(_char => {
		configure(_char)
		result += getColored(format(_char))
		details.lastDetails = {
			char: _char,
			inString: details.inString
		}
	})

	result = result
		.replace(/ true/g, colorize('&nbsp;true', 'yellow'))
		.replace(/ false/g, colorize('&nbsp;false', 'yellow'))
		.replace(/ null/g, colorize('&nbsp;null', 'yellow'))

  return result
}

export default InsertSyntax