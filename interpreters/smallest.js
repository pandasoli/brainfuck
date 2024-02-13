/**
 * @typedef {Object} BfResult
 * @property {number[]} mem - The memory array
 * @property {string} res - The outputed result
 */

/**
 * @param {string} - Brainfuck code
 * @returns {BfResult}
 */
function bfinterpreter(code = '') {
	const mem = [0]
	let ptr = 0, res = ''

	const find_end = pos => {
		let opened = 1
		for (pos++; pos < code.length; pos++) {
			if      (code[pos] == '[') opened++
			else if (code[pos] == ']') opened--
			if (opened == 0) return pos
		}
	}

	const find_start = pos => {
		let closed = 1
		for (pos--; pos > 0; pos--) {
			if      (code[pos] == '[') closed--
			else if (code[pos] == ']') closed++
			if (closed == 0) return pos
		}
	}

	for (let ip = 0; ip < code.length; ip++) {
		const ch = code[ip]

		if      (ch == '+') mem[ptr] = mem[ptr] == 255 ? 0 : mem[ptr] + 1
		else if (ch == '-') mem[ptr] = mem[ptr] == 0 ? 255 : mem[ptr] - 1
		else if (ch == '>') {ptr++; ptr >= mem.length && mem.push(0)}
		else if (ch == '<') {ptr--; if (ptr == -1) throw new RangeError('Error: pointer cannot be less than 1')}
		else if (ch == '.') res += String.fromCharCode(mem[ptr])
		else if (ch == ',') mem[ptr] = prompt('enter a ch:').charCodeAt(0)
		else if (ch == '[') mem[ptr] == 0 && (ip = find_end(ip))
		else if (ch == ']') mem[ptr] > 0  && (ip = find_start(ip))
		else if (ch == '!') break
	}

	return { mem, res }
}
