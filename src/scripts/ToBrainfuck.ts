
function * To(_text?: string, _pause?: boolean) {
  const props = {
    text: String(_text || 'Panda').split(''),
    pause: Boolean(_pause)
  }
  let memory = 0
	let result = ''

	for (let x = 0; x < props.text.length; x++) {
    const char = props.text[x].charCodeAt(0)
    const resToReturn = { ascii: char, memory, index: x, char: props.text[x], result, error: '' }

    if (props.pause) { yield resToReturn }

    if (char <= 255)
    {
      if (memory < char) {
        if (char - memory > 10) {
          if (result !== '') { result += '<' }

          result +=
            Array( Math.floor((char - memory) / 10) ).fill(null).map(() => '+').join('') +
            '[>' +
            Array( Math.floor((char - memory) / ((char - memory) / 10)) ).fill(null).map(() => '+').join('') +
            '<-]>' +
            Array( Number( String((char - memory) / 10).substring(2, 3) ) ).fill(null).map(() => '+').join('') +
            '.'
        }
        else {
          result +=
            Array( Math.floor(char - memory) ).fill(null).map(() => '+').join('') +
            '.'
        }
      }
      else {
        if (memory - char > 10) {
          if (result !== '') { result += '<' }

          result +=
            Array( Math.floor((memory - char) / 10) ).fill(null).map(() => '+').join('') +
            '[>' +
            Array( Math.floor((memory - char) / ((memory - char) / 10)) ).fill(null).map(() => '-').join('') +
            '<-]>' +
            Array( Number( String((memory - char) / 10).substring(2, 3) ) ).fill(null).map(() => '-').join('') +
            '.'
        }
        else {
          result +=
          Array( Math.floor(memory - char) ).fill(null).map(() => '-').join('') +
            '.'
        }
      }

      memory += (memory === 0) ? char : char - memory
    }
    else {
      resToReturn.error = `Error: ${char} passed from 255 of memory.`
      return resToReturn
    }

    if (props.pause) { yield resToReturn }
	}

  return { memory, result: result + '!' }
}

export default To