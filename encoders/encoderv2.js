
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
 * @param {number} number
 * @return [{number}, {string}, {number}]
 */
function closerTen(number) {
	const unit = number % 10
	const res = number - unit
	return [res, '+', unit]
}

const obj = obj => JSON.parse(obj)
const str = obj => JSON.stringify(obj)

/**
 * @param {string} text - Raw text
 * @param {BfDepv2Config} config - Configuration to start interpretation from & dependencies
 * @returns {BfDepv2Result}
 */
export function * bfencoderv2(text, config = {}) {
	let mem = config.mem ?? [0]
	let ptr = config.ptr ?? 0
	let res = config.res ?? ''
	const max_mem = config.max_mem ?? 0
	const pause = config.pause ?? false	

	function movePtr(from, to) {
		const diff = to - from
		const sign = diff < 0 ? '<' : '>'
		return sign.repeat(Math.abs(diff))
	}

	/**
	 * @param {number} ascii
	 * @param {string} env
	 * @return [{string}, {number[]}, {number}]
	 */
	function loop(ascii, env) {
		let { mem, locks } = obj(env)

		const optr = obj(env).ptr

		// Find the best place for the number
		let [sign, diff, ptr] = mem.reduce((old, cell, i) => {
			if (locks.includes(i)) return old

			const foo = addOrSub(cell, ascii)
			return foo[1] < old[1] ? [...foo, i] : old
		}, [null, 128, null])

		if (diff === 0)
			return []

		locks.push(ptr)

		// Get the smallest factors of the ascii
		// also prevent from primes
		let bestPair = closestFactors(diff)
		let isPrime = false

		if (bestPair.includes(1)) {
			bestPair = closestFactors(--diff)
			isPrime = true
		}

		// Make code
		const nenv = str({ mem, ptr: optr, locks });
		let counter_code, counter_ptr
		[counter_code, mem, counter_ptr] = single(bestPair[0], nenv)

		if (counter_code === null) {
			locks = locks.filter(e => e !== ptr)
			return []
		}

		let code = `
			${counter_code}
			[
				${movePtr(counter_ptr, ptr)} ${sign.repeat(bestPair[1])}
				${movePtr(ptr, counter_ptr)} -
			]
			${movePtr(counter_ptr, ptr)}
			${isPrime ? sign : ''}
		`.replace(/\s+/g, '')

		locks = locks.filter(e => e !== ptr)

		// Update memory
		mem[ptr] +=            sign === '+' ? diff : -diff
		mem[ptr] += isPrime ? (sign === '-' ? -1 : 1) : 0
		mem[counter_ptr] = 0
		if (mem[ptr] > 127) mem[ptr] -= 128
		if (mem[ptr] < 0)   mem[ptr] = 128 + mem[ptr]

		if (ascii % 10 !== 0) {
			const [base, sign, unit] = closerTen(ascii)

			const { mem: _mem, locks: _locks } = obj(env)
			const nenv = str({ mem: _mem, ptr: optr, locks: _locks })

			let [ncode, nmem, nptr] = loop(base, nenv)
			ncode += sign.repeat(unit)

			if (ncode.length < code.length) {
				nmem[nptr] += sign === '+' ? unit : -unit;
				[code, mem, ptr] = [ncode, nmem, nptr]
			}
		}

		return [code, mem, ptr]
	}

	/**
	 * @param {number} ascii
	 * @param {string} env
	 * @return [{string}, {number[]}, {number}]
	 */
	function single(ascii, env) {
		const { locks } = obj(env)
		let { mem, ptr } = obj(env)

		const optr = ptr

		let sign, diff

		// Find the best place for the number
		if (locks.length < mem.length)
			[sign, diff, ptr] = mem.reduce((old, cell, i) => {
				if (locks.includes(i)) return old

				const foo = addOrSub(cell, ascii)
				return foo[1] < old[1] ? [...foo, i] : old
			}, [null, 128, null])

		// If all cells are locked try creating one
		else {
			if (max_mem > 0 && mem.length === max_mem)
				return null

			ptr = mem.push(0) - 1;
			[sign, diff] = addOrSub(0, ascii)
		}

		// Make code
		let code = movePtr(optr, ptr) + sign.repeat(diff)

		// Update memory state
		// use `128` to consider 0 on a byte-overflow
		mem[ptr] = mem[ptr] + (sign === '+' ? diff : -diff)
		if (mem[ptr] > 127) mem[ptr] -= 128
		if (mem[ptr] < 0)   mem[ptr] = 128 + mem[ptr]

		// Test if the code would be smaller if created new cell
		{
			const { mem: _mem, ptr: _ptr } = obj(env)

			if (!_mem.includes(0) && (max_mem === 0 || _mem.length < max_mem)) {
				_mem.push(0)

				const nenv = str({ mem: _mem, ptr: _ptr, locks })
				const [ncode, nmem, nptr] = single(ascii, nenv)

				if (ncode.length < code.length)
					[code, mem, ptr] = [ncode, nmem, nptr]
			}
		}

		// Test if `<[-]+++++++`-like would be smaller
		if (Math.abs(optr - ptr) + 3 + ascii < code.length) {
			code = movePtr(optr, ptr) + '[-]' + '+'.repeat(ascii)

			mem = obj(env).mem
			mem[ptr] = ascii
		}

		// Test if `<[+]-------`-like would be smaller
		if (Math.abs(optr - ptr) + 3 + (128 - ascii) < code.length) {
			code = movePtr(optr, ptr) + '[+]' + '-'.repeat(128 - ascii)

			mem = obj(env).mem
			mem[ptr] = ascii
		}

		return [code, mem, ptr]
	}

	/**
	 * @param {string} ch - Character
	 * @returns {string}
	 */
	function encode(ch) {
		const ascii = ch.charCodeAt(0)
		if (ascii > 127) throw 'Unexpected ASCII character to be greater than 127'

		const env = str({ mem, ptr, locks: [] })

		const [single_code, single_mem, single_ptr] = single(ascii, env)
		const [loop_code, loop_mem, loop_ptr] = loop(ascii, env)

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
