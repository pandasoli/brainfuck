
function * text_bf(_text, _pause) {
    const text = String(_text || '').split('')
    let memory = 0
	let result = ''

	for (let x = 0; x < text.length; x++) {
        const char = text[x].charCodeAt(0)

        if (char <= 255)
        {
            if (memory < char) {
                if (char - memory > 10) {
                    if (result !== '') { result += '<' }

                    result +=
                        Array( Math.floor((char - memory) / 10) ).fill().map(() => '+').join('') +
                        '[>' +
                        Array( Math.floor((char - memory) / ((char - memory) / 10)) ).fill().map(() => '+').join('') +
                        '<-]>' +
                        Array( Number( String((char - memory) / 10).substring(2, 3) ) ).fill().map(() => '+').join('') +
                        '.'
                }
                else {
                    result +=
                        Array( Math.floor(char - memory) ).fill().map(() => '+').join('') +
                        '.'
                }
            }
            else {
                if (memory - char > 10) {
                    if (result !== '') { result += '<' }

                    result +=
                        Array( Math.floor((memory - char) / 10) ).fill().map(() => '+').join('') +
                        '[>' +
                        Array( Math.floor((memory - char) / ((memory - char) / 10)) ).fill().map(() => '-').join('') +
                        '<-]>' +
                        Array( Number( String((memory - char) / 10).substring(2, 3) ) ).fill().map(() => '-').join('') +
                        '.'
                }
                else {
                    result +=
                    Array( Math.floor(memory - char) ).fill().map(() => '-').join('') +
                        '.'
                }
            }

            memory += (memory === 0) ? char : char - memory
        }

        if (_pause) { yield { ascii: char, memory, index: x, char: text[x], result } }
	}

    yield { memory, result: result + '!' }
}
