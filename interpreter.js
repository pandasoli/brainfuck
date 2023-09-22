
/**
* @param {string} code your brainfuck code goes here
* @yields {object}
* @returns {object}
*/
module.exports = function * bfinterpreter(code = '') {
	const mem = [0]
	const loops = []
	let ptr = 0
	let res = ''

	for (var i = 0; i < code.length; i++)
		do {
			const ch = code[i]

			if      (ch == '+') mem[ptr] = mem[ptr] == 255 ? 0 : mem[ptr] + 1
			else if (ch == '-') mem[ptr] = mem[ptr] == 0 ? 255 : mem[ptr] - 1
			else if (ch == '>') ptr++; if (ptr >= mem.length) mem.push(0)
			else if (ch == '<') ptr--; if (ptr == -1) throw new RangeError('Error: pointer cannot be less than 1')
			else if (ch == '.') res += String.fromCharCode(mem[ptr])
			else if (ch == ',') mem[ptr] = prompt('enter a ch:').charCodeAt(0)
			else if (ch == '!') return { mem, ptr, i, res, loops }
			else if (ch == '[') loops.unshift(i)
			else if (ch == ']') mem[ptr] == 0 ? loops.shift() : i = loops[0]
		}
		while (loops.length > 0 && i++)

	return { mem, ptr, i, res, loops }
}
