
/**
 * @typedef {Object} Backpatch
 * @property {string} label
 * @property {number} position
 * @property {number[]} jmps
 */

/**
 * @param {string} asm Assembly code
 * @returns {Uint8Array} Bytecode
 */
export const compile = asm => {
	/** @type {Backpatch[]} */ const backpatches = []
	/** @type {number[]}    */ let result = []
	/** @type {number}      */ let position = 0

	const fixNum = n => typeof n === 'string'
		? +n.substring(1)
		: n

	const i8Byte = b => fixNum(b)
		.toString(16)
		.toUpperCase()
		.padStart(2, '0')

	const i32Bytes = n => {
		n = +n.substring(1)
		return [...Array(4)]
			.map(() => {
				const e = n & 0xFF
				n >>= 8
				return e
			})
			.map(b => i8Byte(`$${b}`))
	}

	const codes = {
		'ret': _ => ['C3'],
		'syscall': _ => ['0F', '05'],

		'push': args => {
			switch (args[0]) {
				case '%rdi': return ['57']
				default:
					console.error(`Unimplemented \x1b[2mpush\x1b[m for \x1b[31m${args[0]}\x1b[m`)
			}
		},
		'pop': args => {
			switch (args[0]) {
				case '%rdi': return ['5F']
				default:
					console.error(`Unimplemented \x1b[2mpop\x1b[m for \x1b[31m${args[0]}\x1b[m`)
			}
		},

		'cmpb': args => {
			switch (args[1]) {
				case '(%rdi)': return ['80', '3F', i8Byte(args[0])]
				default:
					console.error(`Unimplemented \x1b[2mcmpb\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},

		'add': args => {
			switch (args[1]) {
				case '%rdi': return ['48', '83', 'C7', i8Byte(args[0])]
				default:
					console.error(`Unimplemented \x1b[2madd\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},
		'sub': args => {
			switch (args[1]) {
				case '%rdi': return ['48', '83', 'EF', i8Byte(args[0])]
				default:
					console.error(`Unimplemented \x1b[2msub\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},

		'addb': args => {
			switch (args[1]) {
				case '(%rdi)': return ['80', '07', i8Byte(args[0])]
				default:
					console.error(`Unimplemented \x1b[2maddb\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},
		'subb': args => {
			switch (args[1]) {
				case '(%rdi)': return ['80', '2F', i8Byte(args[0])]
				default:
					console.error(`Unimplemented \x1b[2msubb\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},

		'mov': args => {
			switch (args[1]) {
				case '%rax': return ['48', 'C7', 'C0', ...i32Bytes(args[0])]
				case '%rdi': return ['48', 'C7', 'C7', ...i32Bytes(args[0])]
				case '%rdx': return ['48', 'C7', 'C2', ...i32Bytes(args[0])]
				case '%rsi':
					if (args[0] === '%rdi')
						return ['48', '89', 'FE']
					/* falls through */
				default:
					console.error(`Unimplemented \x1b[2mmov\x1b[m for \x1b[31m${args[1]}\x1b[m`)
			}
		},

		'jz': args => {
			const patch = backpatches.find(e => e.label === args[0])
			if (patch) patch.jmps.push(position + 1)
			else backpatches.push({ label: args[0], jmps: [position + 1] })
			return ['74', '00']
		},
		'jnz': args => {
			const patch = backpatches.find(e => e.label === args[0])
			if (patch) patch.jmps.push(position + 1)
			else backpatches.push({ label: args[0], jmps: [position + 1] })
			return ['75', '00']
		}

		//'xor': args => {
		//	if (args[0] === '%rdi' && args[0] === args[1])
		//		return ['48', '31', 'FF']
		//	console.error(`Unimplemented \x1b[2mxor\x1b[m for \x1b[31m${args[1]}\x1b[m`)
		//}
	}

	/**
	 * @param {string} line Assembly line
	 * @returns {[instruction, args]}
	 */
	const split = line => {
		const parts = line.split(' ')

		const instruction = parts[0]
		const args = parts.slice(1).join('').split(',')

		return [instruction, args]
	}

	/**
	 * @param {string} instruction Assembly operation (add, mov, lea)
	 * @param {string[]} args Operands (%rax, $1, (%rdi))
	 * @returns {number[]} Bytecode
	 */
	const convert = (instruction, args) => {
		/** @type {string[]|undefined} */ const hex = codes[instruction]?.(args)
		/** @type {number[]|undefined} */ const bytes = hex?.map(e => parseInt(e, 16))

		if (instruction.endsWith(':')) {
			const label = instruction.slice(0, -1)
			const patch = backpatches.find(e => e.label === label)

			if (patch) patch.position = position
			else backpatches.push({ label, position, jmps: [] })
		}
		else if (!bytes)
			console.error(`Unimplemented \x1b[32m${instruction}\x1b[m!`)

		return bytes ?? []
	}

	asm.split('\n').forEach(line => {
		const bytes = convert(...split(line))
		result = [...result, ...bytes]
		position = result.length
	})

	backpatches.forEach(patch =>
		patch.jmps.forEach(jmp => {
			result = [
				...result.slice(0, jmp),
				(patch.position - jmp - 1) & 0xFF, // No idea why -1
				...result.slice(jmp + 1)
			]
		})
	)

	return new Uint8Array(result)
}
