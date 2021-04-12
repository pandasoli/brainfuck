
function * bf_(_text) {
	const text = String(_text || '').split('')
    let memory = 0
	let result = ''

	for (let x = 0; x < text.length; x++) {
        const char = text[x].charCodeAt(0)

        if (char <= 255)
        {
            if (memory < char) {
                result += Array( Math.floor((char - memory) / 10) ).fill().map(() => '+').join('') +
                    '[>' +
                    Array(Math.floor((char - memory) / ((char - memory) / 10))).fill().map(() => '+').join('') +
                    '<-]>' +
                    Array(Number( String((char - memory) / 10 % 1).substring(2, 3) ) + 1).fill().map(() => '+').join('') +
                    '.'

                // memory = char
            }
            else {

            }

            memory = 0
        }

        yield { char, memory, result }
	}

    yield result + '!'
}
