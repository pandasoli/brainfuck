
function * bf(_code = '', _getChar = () => prompt('enter a char:')) {
	const memory = '000000000000000000000000000'.split('').map(item => Number(item))
	const acceptedChars = '+-<>.,[]!'
	let pointer = 0
	let result = ''
	const loop = { open: 0, start: [] }

	String(_code).split('')
	for (let x = 0; x < _code.length; x++) {
		do {
			const char = _code[x]

			if (acceptedChars.includes(char)) { yield { mem: memory, poin: pointer, res: result, char: x, ascii: char } }

			if (char == '+') { memory[pointer]++; if (memory[pointer] == 256) { memory[pointer] = 0 } }
			if (char == '-') { memory[pointer]--; if (memory[pointer] == -1) { memory[pointer] = 255 } }
			if (char == '>') { if (pointer < memory.length - 1) { pointer++ } }
			if (char == '<') { if (pointer > 0) { pointer-- } }
			if (char == '.') { result += String.fromCharCode( memory[pointer] ) }
			if (char == ',') { memory[pointer] = _getChar().charCodeAt(0) }
			if (char == '!') { return { mem: memory, poin: pointer, res: result, char: x, ascii: char } }
			if (char == '[') { loop.start.unshift(x) }
			if (char == ']') { if (memory[pointer] == 0) { loop.start.shift() } else { x = loop.start[0] } }

			if (acceptedChars.includes(char)) { yield { mem: memory, poin: pointer, res: result, char: x, ascii: char } }

			if (loop.open > 0) { x++ }
		} while (loop.open > 0)
	}

	return { mem: memory, poin: pointer, res: result, char: x, ascii: char }
}
