
/**
 * @typedef {Object} BfDepv2Result
 * @property {number[]} mem - The memory array
 * @property {string} res - The outputed result
 */

/**
 * @typedef {Object} BfDepv2Config
 * @property {number[]} mem - The memory array
 * @property {number} max_mem - Max memory size
 * @property {number} ptr - Selected memory index
 * @property {number} ip - Intruction pointer
 * @property {string} res - The outputed result
 * @property {boolean} pause - Pause when found valid character
 */

/**
 * 44 -> [ 4, 11 ]
 * 32 -> [ 4, 8 ]
 *
 * @param {number} number
 * @returns {number} The best pair of number multipled resulting into `number`
 */
function closestFactors(number) {
	let minDiff = number
	let bestPair = [1, number]

	for (let i = 1; i <= Math.sqrt(number); i++) {
		if (number % i === 0) {
			const factor1 = i
			const factor2 = number / i
			const diff = Math.abs(factor1 - factor2)

			if (diff < minDiff) {
				minDiff = diff
				bestPair = [factor1, factor2]
			}
		}
	}

	return bestPair
}

/**
 * @param {number} mem
 * @param {number} number
 * @returns [{string}, {number}]
 */
function addOrSub(mem, number) {
	const inside = Math.abs(mem - number)
	const inside_sign = mem - number >= 0 ? '-' : '+'
	let outside_add = 127 - mem + number
	let outside_sub = mem + 127 - number

	if (outside_add > 127) outside_add = 127
	if (outside_sub > 127) outside_sub = 127

	if (outside_add < inside && outside_add < outside_sub)
		return ['+', outside_add + 1]

	if (outside_sub < inside)
		return ['-', outside_sub + 1]

	return [inside_sign, inside]
}

/**
 * @param {string} text - Raw text
 * @param {BfDepv2Config} config - Configuration to start interpretation from & dependencies
 * @returns {BfDepv2Result}
 */
export function * bfdepreterv2(text, config = {}) {
	let mem = config.mem ?? [0]
	let ptr = config.ptr ?? 0
	let res = config.res ?? ''
	let locked_cells = []
	const max_mem = config.max_mem ?? 0
	const pause = config.pause ?? false

	function movePtr(i) {
		const diff = i - ptr
		const sign = diff < 0 ? '<' : '>'
		ptr = i
		return sign.repeat(Math.abs(diff))
	}

	/**
	 * @param {number} number
	 * @returns {string}
	 */
	function loop(number) {
		// Find the best place for the number
		let [sign, diff, i] = mem.reduce((old, cell, i) => {
			if (locked_cells.includes(i)) return old

			const foo = addOrSub(cell, number)
			return foo[1] < old[1] ? [...foo, i] : old
		}, [null, 128])

		if (diff === 0)
			return null

		locked_cells.push(i)

		// Get the smallest factors of the ascii
		//   Also prevent from primes
		let bestPair = closestFactors(diff)
		let isPrime = false

		if (bestPair.includes(1)) {
			bestPair = closestFactors(--diff)
			isPrime = true
		}

		// Write the result
		const counter_code = single(bestPair[0])
		const counter_i = ptr

		if (counter_code === null) {
			locked_cells = locked_cells.filter(e => e !== i)
			return null
		}

		const code = `
			${counter_code}
			[
				${movePtr(i)}         ${sign.repeat(bestPair[1])}
				${movePtr(counter_i)} -
			]
			${movePtr(i)}
			${isPrime ? sign : ''}
		`.replace(/\s+/g, '')

		// Update memory
		mem[i] +=            sign === '+' ? diff : -diff
		mem[i] += isPrime ? (sign === '+' ? -1 : 1) : 0
		mem[counter_i] = 0
		if (mem[i] > 127) mem[i] -= 128
		if (mem[i] < 0)   mem[i] = 128 + mem[i]

		locked_cells = locked_cells.filter(e => e !== i)
		return code
	}

	/**
	 * @param {number} number
	 * @returns {string}
	 */
	function single(number) {
		let sign, diff, i

		// Find the best place for the number
		if (locked_cells.length < mem.length) {
			[sign, diff, i] = mem.reduce((old, cell, i) => {
				if (locked_cells.includes(i)) return old

				const foo = addOrSub(cell, number)
				return foo[1] < old[1] ? [...foo, i] : old
			}, [null, 128])
		}
		// If all cells are locked try creating one
		else {
			if (max_mem > 0 && mem.length === max_mem)
				return null

			i = mem.push(0) - 1;
			[sign, diff] = addOrSub(0, number)
		}

		// Make code
		const o_mem = [...mem]
		const o_ptr = ptr

		let code = movePtr(i) + sign.repeat(diff)
		let code_mem = [...mem]
		let code_ptr = ptr

		// Update memory state
		//   Use `128` to consider 0 on a byte-overflow
		code_mem[i] = code_mem[i] + (sign === '+' ? diff : -diff)
		if (code_mem[i] > 127) code_mem[i] -= 128
		if (code_mem[i] < 0) code_mem[i] = 128 + code_mem[i]

		let foo
		mem = o_mem; ptr = o_ptr

		// Test if the code would be smaller if created new cell
		if (!mem.includes(0) && (max_mem === 0 || mem.length < max_mem)) {
			mem.push(0)

			foo = single(number)
			if (foo.length < code.length) {
				code = foo
				code_mem = [...mem]
				code_ptr = ptr
			}
			mem = o_mem; ptr = o_ptr
		}

		// Test if `<[-]+++++++`-like would be smaller
		// NOTE: Possibly not the fastest to interpretate
		foo = `${movePtr(i)}[-]${'+'.repeat(number)}`
		if (foo.length < code.length) {
			code = foo
			code_mem[i] = number
			code_ptr = i
		}
		mem = o_mem; ptr = o_ptr

		// Test if `<[+]-------`-like would be smaller
		// NOTE: Possibly not the fastest to interpretate
		foo = `${movePtr(i)}[+]${'-'.repeat(128 - number)}`
		if (foo.length < code.length) {
			code = foo
			code_mem[i] = number
			code_ptr = i
		}
		mem = o_mem; ptr = o_ptr

		// Update memory state
		mem = code_mem
		ptr = code_ptr

		return code
	}

	/**
	 * @param {string} ch - Character
	 * @returns {string}
	 */
	function encode(ch) {
		const ascii = ch.charCodeAt(0)
		if (ascii > 127) throw 'Unexpected ASCII character to be greater than 127'

		// Choose loop or inperative
		const o_mem = [...mem]
		const o_ptr = ptr

		const single_code = single(ascii)
		const single_mem = [...mem], single_ptr = ptr
		mem = o_mem; ptr = o_ptr

		const loop_code = loop(ascii)
		const loop_mem = [...mem], loop_ptr = ptr
		mem = o_mem; ptr = o_ptr

		if (loop_code?.length < single_code?.length) {
			mem = loop_mem
			ptr = loop_ptr
			return loop_code
		}

		mem = single_mem
		ptr = single_ptr
		return single_code
	}

	let ip = config.ip ?? 0
	for (; ip < text.length; ip++) {
		res += encode(text.split('')[ip]) + '.'

		if (pause) yield {mem, ptr, ip, res}
	}

	return {mem, ptr, ip, res}
}
