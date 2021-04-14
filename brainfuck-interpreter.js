
function * bf_text(_code, _pause, _getChar) {
	const code = String(_code || '').split('')
	const getChar = _getChar || ( () => prompt('enter a char:') )
	const memory = [0]
	const acceptedChars = '+-<>.,[]!'
	let pointer = 0
	let result = ''
	const loop = []

	for (let x = 0; x < code.length; x++) {
		do {
			const char = code[x]

			if (acceptedChars.includes(char)) {
				if (_pause) { yield { memory, pointer, result, index: x, char } }

				if (char === '+') { memory[pointer] = (memory[pointer] === 255) ? 0 : memory[pointer] + 1 }
				else if (char === '-') { memory[pointer] = (memory[pointer] === 0) ? 255 : memory[pointer] - 1 }
				else if (char === '>') { pointer++; (pointer === memory.length) ? memory.push(0) : '' }
				else if (char === '<') { pointer--; if (pointer === -1) { throw 'Error: pointer can not be less than 1' } }
				else if (char === '.') { result += String.fromCharCode( memory[pointer] ) }
				else if (char === ',') { memory[pointer] = getChar().charCodeAt(0) }
				else if (char === '!') { break }
				else if (char === '[') { loop.unshift(x) }
				else if (char === ']') { (memory[pointer] === 0) ? loop.shift() : x = loop[0] }

				if (_pause) { yield { memory, pointer, result, index: x, char } }
			}

		} while (loop.length > 0 && x++)
	}

	return { memory, pointer, result }
}
