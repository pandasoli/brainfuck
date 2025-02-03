'use strict'

/**
 * @typedef {Object} BfEncoderv2Result
 * @property {number[]} mem - The memory array
 * @property {number} max_mem - Max memory size
 * @property {number} ptr - Current memory index
 * @property {number} ip - Intruction pointer
 * @property {string} res - The outputed result
 * @property {boolean} pause - Pause when found valid character
 * @property {string} err - Error
 */

/**
 * @typedef {Object} Environment
 * @property {number[]} mem - The memory array
 * @property {number} ptr - Current memory index
 * @property {number[]} locks - Locked memory indexes
 */

/**
 * @param {any} obj - Object to copy
 * @return {any} - New object instance
 * @desc Create a new instance of an existing object
 */
const copy = obj =>
	JSON.parse(JSON.stringify(obj))

/**
 * @param {number} curr - Current value
 * @param {number} target - Target value
 * @returns {{ sign: string, steps: number }}
 * @desc Determine the optimal adjustment (direct or wrap-around) to convert a value to a target
 */
const adjustValue = (curr, target) => {
	const steps = Math.abs(curr - target)
	const sign = curr >= target ? '-' : '+'

	const wrapAdd = Math.min(127 - curr + target, 127)
	const wrapSub = Math.min(curr + 127 - target, 127)

	if (wrapAdd < steps && wrapAdd < wrapSub) return {sign: '+', steps: wrapAdd + 1}
	if (wrapSub < steps) return {sign: '-', steps: wrapSub + 1}

	return {sign, steps}
}

/**
 * @param {Environment} env
 * @param {string} val - Target value
 * @returns {{ sign: string, steps: number, cell: number }|null}
 * @desc Find the closest unlocked cell's value to the target
 */
const findNearestCloestUnlockedCell = (env, val) => {
	const locks = new Set(env.locks)

	return env.mem.reduce((old, cell, i) => {
		if (locks.has(i)) return old

		const {sign, steps} = adjustValue(cell, val)
		const new_ = {sign, steps, cell: i}

		if (!old) return new_

		if (old.cell + old.steps < i + steps) return old
		return new_
	}, null)
}

/**
 * @param {Environment} env
 * @returns {number|null} - Memory index
 * @desc Find the nearest unlocked cell to the pointer
 */
const findNearestUnlockedCell = env => {
	const locks = new Set(env.locks)

	return env.mem
		.map((_, i) => locks.has(i) ? null : { index: i, steps: Math.abs(i - env.ptr) })
		.filter(Boolean)
		.sort((a, b) => a.steps - b.steps)
		.map(({ index }) => index)[0] ?? null
}

/**
 * @param {number} val - Value
 * @returns {number[]|null} - List of factors
 * @desc Perform integer factorization
 */
const integerFactorization = val => {
	if (val <= 3) return null

	let factor1 = Math.floor(Math.sqrt(val))
	while (val % factor1 !== 0)
		factor1--

	const factor2 = val / factor1
	return [factor1, factor2]
}

class Methods {
	/**
	 * @param {number} max_mem - Max memory size
	 */
	constructor(max_mem) {
		this.max_mem = max_mem
	}

	/**
	 * @param {Environment} env
	 * @param {boolean} set - Set pointer
	 * @desc Move pointer to memory index
	 */
	move(env, to, set = false) {
		const steps = to - env.ptr
		const sign = steps < 0 ? '<' : '>'
		if (set) env.ptr = to
		return sign.repeat(Math.abs(steps))
	}

	/**
	 * @param {Environment} env
	 * @param {number} val - Value
	 * @return {{ code: string, env: Environment, err?: string }}
	 * @desc Just increment or decrement
	 */
	incDec(env, val) {
		const { mem } = env
		let { ptr } = env

		// Find nearest unlocked cell
		ptr = findNearestUnlockedCell(env)
		if (ptr === null)
			return {err: 'All memory cells are locked'}

		const {sign, steps} = adjustValue(mem[ptr], val)

		// Make code
		const code = this.move(env, ptr) + sign.repeat(steps)

		// Update environment
		mem[ptr] = val
		env.mem = mem
		env.ptr = ptr

		return {code, env}
	}

	/**
	 * @param {Environment} env
	 * @param {number} val - Value
	 * @return {{ code: string, env: Environment, err?: string }}
	 * @desc Find the best cell and increment or decrement
	 */
	moveIncDec(env, val) {
		const { mem } = env

		// Find closest unlocked cell value
		const res = findNearestCloestUnlockedCell(env, val)
		if (!res)
			return {err: 'All cells are locked'}

		const { sign, steps, cell: ptr } = res

		// Make code
		const code = this.move(env, ptr) + sign.repeat(steps)

		// Update environment
		mem[ptr] = val
		env.mem = mem
		env.ptr = ptr

		return {code, env}
	}

	/**
	 * @param {Environment} env
	 * @param {number} val - Value
	 * @return {{ code: string, env: Environment, err?: string }}
	 * @desc Create new cell and increment or decrement
	 */
	createIncDec(env, val) {
		const { mem } = env
		let { ptr } = env

		// Create new cell
		if (this.max_mem > 0 && mem.length === this.max_mem)
			return {err: 'Memory cannot grow'}

		ptr = mem.push(0) - 1
		const {sign, steps} = adjustValue(0, val)

		// Make code
		const code = this.move(env, ptr) + sign.repeat(steps)

		// Update environment
		mem[ptr] = val
		env.mem = mem
		env.ptr = ptr

		return {code, env}
	}

	/**
	 * @param {Environment} env
	 * @param {number} val - Value
	 * @return {{ code: string, env: Environment, err?: string }}
	 * @desc Set memory to 0 and increment/decrement
	 */
	zeroIncDec(env, val) {
		let { mem, ptr } = env

		// Find nearest unlocked cell
		ptr = findNearestUnlockedCell(env)
		if (ptr === null)
			return {err: 'All cells are locked'}

		const {sign, steps} = adjustValue(0, val)

		// Make code
		const code = this.move(env, ptr) + '[-]' + sign.repeat(steps)

		// Update environment
		mem[ptr] = val
		env.mem = mem

		return {code, env}
	}

	/**
	 * @param {Environment} env
	 * @param {number} val - Value
	 * @param {(char: string) => { code: string, err?: string }} encode
	 * @return {{ code: string, env: Environment, err?: string }}
	 * @desc Loop
	 */
	loop(env, val, encode) {
		const { mem, locks } = env

		// Find the nearest closest cell for the target
		let target = findNearestCloestUnlockedCell(env, val)
		if (!target) {
			// If no cells left try creating new one

			if (this.max_mem > 0 && mem.length === this.max_mem)
				return {err: 'Memory cannot grow'}

			target = {
				...adjustValue(0, val),
				cell: mem.push(0) - 1
			}
		}

		locks.push(target.cell)

		// Find factors
		let factors = integerFactorization(target.steps)
		let isPrime = false

		if (!factors)
			return {err: `Cannot perform integer factorization on ${val}`}

		if (factors.includes(1)) {
			factors = integerFactorization(target.steps - 1)
			isPrime = true
		}

		// Get details for counter
		const counter = encode(factors[0], env)
		if (counter.err) return err

		env.ptr = counter.env.ptr
		env.mem = counter.env.mem

		// Make code
		const code = counter.code +
			'[' +
			this.move(env, target.cell, true) + target.sign.repeat(factors[1]) +
			this.move(env, counter.env.ptr, true) + '-' +
			']' +
			this.move(env, target.cell, true) +
			(isPrime ? target.sign : '')

		// Update environment
		env.mem[target.cell] = val
		env.mem[counter.env.ptr] = 0
		env.ptr = target.cell
		env.locks = locks.filter(e => e !== target.cell)

		return {code, env}
	}
}

/**
 * @param {string} text - Raw text
 * @param {BfEncoderv2Result} config - Configuration and state to begin from
 * @returns {BfEncoderv2Result}
 * @desc Encode raw text into Brainfuck code
 */
export const bfencoderv2 = function *(text, config = {}) {
	let mem = config.mem ?? [0]
	let ptr = config.ptr ?? 0
	let res = config.res ?? ''
	const max_mem = config.max_mem ?? 0
	const pause = config.pause ?? false	

	/**
	 * @param {string} val - Value
	 * @param {Environment} env
	 * @returns {{ code: string, env: Environment, err?: string }}
	 * @desc Test all encoding techniques and returns the smallest result
	 */
	const encode = (val, env = null) => {
		const methods = new Methods(max_mem)

		if (!env) env = { mem, ptr, locks: [] }
		const results = [
			['incDec', methods.incDec(copy(env), val)],
			['moveIncDec', methods.moveIncDec(copy(env), val)],
			['createIncDec', methods.createIncDec(copy(env), val)],
			['zeroIncDec', methods.zeroIncDec(copy(env), val)],
			['loop', methods.loop(copy(env), val, encode)]
		]

		const result = results.reduce((smallest, curr) => {
			if (curr[1].err) return smallest
			if (smallest[1].err) return curr

			return curr[1].code.length < smallest[1].code.length ? curr : smallest
		})

		if (result.err) return {
			err: results.map(e => `${e[0]}: ${e[1].err}`).join('\n')
		}

		return result[1]
	}

	if (config.err)
		return { err: 'Cannot run with error set' }

	let ip = config.ip ?? 0
	for (; ip < text.length; ++ip)
	{
		const config = {mem, max_mem, ptr, ip, res, pause}

		const val = text[ip].charCodeAt(0)
		if (val > 127) return {...config, err: 'Unexpected ASCII character to be greater than 127'}

		const {code, env, err} = encode(val)
		if (err) return {...config, err}

		res += code + '.'
		mem = env.mem
		ptr = env.ptr

		if (pause) yield config
	}

	return {mem, max_mem, ptr, ip, res, pause}
}
