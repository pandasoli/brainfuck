const MEM_CAP = 255

/**
 * @typedef {Object} Token
 * @property {number} offset
 * @property {string} kind
 * @property {number} times
 * @property {number} linked_to
 */

/**
 * @typedef {Object} Backpatch
 * @property {number} start
 * @property {number} end
 */

class ErrorManager {
	/** @type {string} */ code = ''

	constructor(code) {
		this.code = code
	}

	error(offset, msg) {
		console.log('\x1b[31mERROR:\x1b[0m', msg)
		console.log()

		let code = (
			this.code.substring(0, offset) +
			'\x1b[58;5;1;4:3m' + this.code[offset] + '\x1b[m' +
			this.code.substring(offset + 1, this.code.length)
		).split('\n')

		const errline = this.code.substring(0, offset).split('\n').length

		const first_line = errline - 3 < 0 ? 0 : errline - 3
		const last_line = errline + 2 >= code.length ? code.length : errline + 2

		for (let i = first_line; i < last_line; i++)
			console.log(i + 1, code[i])
	}
}

/**
 * @param {string} code
 * @returns {Token[]}
 */
function parse(code) {
	/** @type {Token[]} */ const ops = []

	for (let i = 0; i < code.length; i++) {
		const kind = code[i]
		
		if (!'+-<>.,![]'.includes(kind)) continue

		if (ops.length > 0 && ops[ops.length - 1].kind === kind)
			ops[ops.length - 1].times++
		else
			ops.push({ kind, times: 1, offset: i })

		ops.times &= 0xFF
	}

	return ops
}

const int32ToBytes = num => {
	const bytes = []

	for (let i = 0; i < 4; i++) {
		bytes.push(num & 0xFF) // Get the least significant byte
		num >>= 8              // Shift 8 bits to the right
	}

	return bytes.reverse()
}

const bytesToHexString = bytes =>
	bytes.map(n => n
		.toString(16)
		.toUpperCase()
		.padStart(2, '0')
	)

const assemble = (op, args) => {
	switch (op) {
		case 'add':
			switch (args[0]) {
				case '[rdi]': return ['80', '07', args[1]]
				case 'rdi': {
					const num = parseInt(args[1], 16)
					const hexTimes = bytesToHexString(int32ToBytes(num)).reverse()
					return ['48', '81', 'C7', ...hexTimes]
				}

				default:
					console.error(`Unimplemented! add for ${args}`)
			}
			return []

		case 'sub':
			switch (args[0]) {
				case '[rdi]': return ['80', '2F', args[1]]
				case 'rdi': {
					const num = parseInt(args[1], 16)
					const hexTimes = bytesToHexString(int32ToBytes(num)).reverse()
					return ['48', '81', 'EF', ...hexTimes]
				}

				default:
					console.error(`Unimplemented! sub for ${args}`)
			}
			return []

		case 'mov':
			switch (args[0]) {
				case 'al':
					if (args[1] === '[rdi]')
						return ['8A', '07']
					else
						console.error('Unimplemented!')
					return []

				case 'rax': {
					const num = parseInt(args[1], 16)
					const hexNum = bytesToHexString(int32ToBytes(num)).reverse()
					return ['48', 'C7', 'C0', ...hexNum]
				}

				case 'rdi': {
					const num = parseInt(args[1], 16)
					const hexNum = bytesToHexString(int32ToBytes(num)).reverse()
					return ['48', 'C7', 'C7', ...hexNum]
				}

				case 'rsi':
					if (args[1] === 'rdi')
						return ['48', '89', 'FE']
					else
						console.error('Unimplemented!')
					return []

				case 'rdx': {
					const num = parseInt(args[1], 16)
					const hexNum = bytesToHexString(int32ToBytes(num)).reverse()
					return ['48', 'C7', 'C2', ...hexNum]
				}

				default:
					console.error(`Unimplemented! mov for ${args}`)
			}
			return []

		case 'push':
			switch (args[0]) {
				case 'rdi': return ['57']

				default:
					console.error('Unimplemented!')
			}
			return []

		case 'pop':
			switch (args[0]) {
				case 'rdi': return ['5F']

				default:
					console.error('Unimplemented!')
			}
			return []

		case 'test':
			if (args[0] === 'al' && args[1] === 'al')
				return ['84', 'C0']
			else
				console.error('Unimplemented!')
			return []

		case 'jz': {
			const addr = parseInt(args[0], 16)
			const hexAddr = bytesToHexString(int32ToBytes(addr)).reverse()
			return ['0F', '84', ...hexAddr]
		}

		case 'jnz': {
			const addr = parseInt(args[0], 16)
			const hexAddr = bytesToHexString(int32ToBytes(addr)).reverse()
			return ['0F', '85', ...hexAddr]
		}

		case 'ret': return ['C3']
		case 'syscall': return ['0F', '05']

		default:
			console.error('Unimplemented!')
	}

	return []
}


/**
 * @param {Token[]} tokens
 * @param {ErrorManager} err
 * @returns {Uint8Array}
 */
function compile(tokens, err) {
	/** @type {number[]}    */ let result = []
	/** @type {number}      */ let pointer = 0
	/** @type {number[]}    */ const loops_start = []
	/** @type {Backpatch[]} */ const backpatches = []
	
	const write = code => {
		const lines = code
			.split('\n')
			.map(e => e.trim())
			.filter(e => e)

		for (const line of lines) {
			const op = line.split(' ')[0]
			const args = line
				.substring(op.length)
				.split(',')
				.map(e => e.trim())
				.filter(e => e)

			const code = assemble(op, args)
				.map(e => parseInt(e, 16))

			result = [...result, ...code]
		}
	}


	for (const token of tokens) {
		switch (token.kind) {
			case '+': {
				const times = bytesToHexString([token.times])[0]
				write(`add [rdi], ${times}`)
			} break

			case '-': {
				const times = bytesToHexString([token.times])[0]
				write(`sub [rdi], ${times}`)
			} break

			case '[':
				for (const _ of Array(token.times)) {
					write(`
						mov al, [rdi]
						test al, al
						jz 0`)

					const addr = result.length
					loops_start.push(addr)
				}
				break

			case ']':
				for (const i of Array(token.times)) {
					if (loops_start.length == 0) {
						err.error(op.offset + i, 'Cannot finish unstarted loop!')
						return
					}

					write(`
						mov al, [rdi]
						test al, al
						jnz 0`)

					backpatches.push({
						start: loops_start.pop(),
						end: result.length
					})
				}
				break

			case '<': {
				write(`sub rdi, ${token.times}`)

				if (pointer > 0)
					pointer--
				else {
					err.error(op.offset, 'Memory index cannot be less than 0!')
					return
				}
			} break

			case '>': {
				write(`add rdi, ${token.times}`)

				if (pointer < MEM_CAP)
					pointer++
				else {
					console.error(op.offset, 'Memory index cannot be bigger than memory capacity!')
					return
				}
			} break

			case '.':
				for (const _ of Array(token.times))
					write(`
						push rdi
						mov rax, 1
						mov rsi, rdi
						mov rdi, 1
						mov rdx, 1
						syscall
						pop rdi`)
				break

			case ',':
				for (const _ of Array(token.times))
					write(`
						push rdi
						mov rax, 0
						mov rsi, rdi
						mov rdi, 0
						mov rdx, 1
						syscall
						pop rdi`)
				break

			case '!':
				write(`ret`)
		}
	}

	/* Add finish program instruction */
	write(`ret`)

	/* Resolve loop start instructions */
	for (const backpatch of backpatches) {
		// Backpatch start
		{
			const left = result.slice(0, backpatch.start - 4)
			const right = result.slice(backpatch.start, result.length)

			const addr = backpatch.end - backpatch.start
			const addr_i32 = int32ToBytes(addr).reverse()

			result = [...left, ...addr_i32, ...right]
		}

		// Backpatch end
		{
			const left = result.slice(0, backpatch.end - 4)
			const right = result.slice(backpatch.end, result.length)

			const addr = -1 * (backpatch.end - backpatch.start)
			const addr_i32 = int32ToBytes(addr).reverse()

			result = [...left, ...addr_i32, ...right]
		}
	}

	return new Uint8Array(result)
}

function run(code) {
	const tokens = parse(code)
	const bin = compile(tokens, new ErrorManager(code))

	if (!bin) return

	// Load the C library
	const libSuffix =
		Deno.build.os === 'windows' ? 'dll' :
		Deno.build.os === 'darwin'  ? 'dylib' :
		'so'
	const libName = `./main.${libSuffix}`

	const dylib = Deno.dlopen(
		libName,
		{
			run: {
				parameters: ['buffer', 'u32', 'i32'],
				result: 'void'
			}
		}
	)

	// Allocate and initialize memory for the data in C
	const buf = new Uint8Array(bin.length)

	for (let i = 0; i < bin.length; i++)
		buf[i] = bin[i]

	// Call the C function
	dylib.symbols.run(buf, bin.length, MEM_CAP)
}

run(`++++++++
[
  > ++++++++++
  < -
]
> . P 80

+++++++++++++++++ . a 97
+++++++++++++ . n 110
---------- . d 100
--- . a 97
!`)
