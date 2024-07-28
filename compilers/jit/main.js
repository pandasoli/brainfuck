import { Buffer } from 'node:buffer'

const MEM_CAP = 255

/**
 * @typedef {Object} Op
 * @property {number} offset
 * @property {string} kind
 * @property {number} times
 * @property {number} linked_to
 */

/**
 * @typedef {Object} Backpatch
 * @property {number} loop_start
 * @property {number} loop_end
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
 * @returns {Op[]}
 */
function parse(code) {
	/** @type {Op[]} */ const ops = []

	for (let i = 0; i < code.length; i++) {
		const kind = code[i]
		
		if (!'+-<>.,![]'.includes(kind)) continue

		if (ops.length > 0 && ops[ops.length - 1].kind === kind)
			ops[ops.length - 1].times++
		else
			ops.push({ kind, times: 1, offset: i })
	}

	return ops
}

/**
 * @param {Op[]} ops
 * @param {ErrorManager} err
 * @returns {Uint8Array}
 */
function compile(ops, err) {
	/** @type {number[]}    */ let code = []
	/** @type {number}      */ let mem_index = 0
	/** @type {number[]}    */ const loops_start = []
	/** @type {Backpatch[]} */ const backpatches = []

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


	for (const op of ops) {
		/** @type {string[]} */
		let bytes = []

		switch (op.kind) {
			case '+': {
				const times = op.times & 0xFF
				const times_hex = bytesToHexString([times])[0]

				bytes = [
					// add byte [rdi], <uint8>
					'80', '07', times_hex 
				]
			} break

			case '-': {
				const times = op.times & 0xFF
				const times_hex = bytesToHexString([times])[0]

				bytes = [
					// sub byte [rdi], <uint8>
					'80', '2F', times_hex
				]
			} break

			case '[':
				for (const _ of Array(op.times)) {
					bytes = [
						...bytes,
						'8A', '07',                        // mov al, byte [rdi]
						'84', 'C0',                        // test al, al
						'0F', '84', '00', '00', '00', '00' // jz 0
					]

					const addr = code.length + bytes.length
					loops_start.push(addr)
				}
				break

			case ']':
				for (const i of Array(op.times)) {
					if (loops_start.length == 0) {
						err.error(op.offset + i, 'Cannot finish unstarted loop!')
						return
					}

					bytes = [
						...bytes,
						'8A', '07',                        // mov al, byte [rdi]
						'84', 'C0',                        // test al, al
						'0F', '85', '00', '00', '00', '00' // jnz 0
					]

					backpatches.push({
						loop_start: loops_start.pop(),
						loop_end: code.length + bytes.length
					})
				}
				break

			case '<':
				bytes = [
					// sub rdi, <int32>
					'48', '81', 'EF', ...bytesToHexString(int32ToBytes(op.times)).reverse()
				]

				if (mem_index > 0)
					mem_index--
				else {
					err.error(op.offset, 'Memory index cannot be less than 0!')
					return
				}
				break

			case '>':
				bytes = [
					// add rdi, <int32>
					'48', '81', 'C7', ...bytesToHexString(int32ToBytes(op.times)).reverse()
				]

				if (mem_index < MEM_CAP)
					mem_index++
				else {
					console.error(op.offset, 'Memory index cannot be bigger than memory capacity!')
					return
				}
				break

			case '.':
				for (const _ of Array(op.times))
					bytes = [
						...bytes,
						'57',                                     // push rdi
						'48', 'C7', 'C0', '01', '00', '00', '00', // mov rax, SYS_write   ; op
						'48', '89', 'FE',                         // mov rsi, rdi         ; buf
						'48', 'C7', 'C7', '01', '00', '00', '00', // mov rdi, SYS_stdout  ; fd
						'48', 'C7', 'C2', '01', '00', '00', '00', // mov rdx, 1           ; length
						'0F', '05',                               // syscall
						'5F'                                      // pop rdi
					]
				break

			case ',':
				for (const _ of Array(op.times))
					bytes = [
						...bytes,
						'57',                                     // push rdi
						'48', 'C7', 'C0', '00', '00', '00', '00', // mov rax, SYS_read   ; op
						'48', '89', 'FE',                         // mov rsi, rdi        ; buf
						'48', 'C7', 'C7', '00', '00', '00', '00', // mov rdi, SYS_stdin  ; fd
						'48', 'C7', 'C2', '01', '00', '00', '00', // mov rdx, 1          ; length
						'0F', '05',                               // syscall
						'5F'                                      // pop rdi
					]
				break

			case '!':
				bytes.push('C3') // ret
		}

		for (const byte of bytes)
			code.push(parseInt(byte, 16))
	}

	/* Add finish program instruction */
	code.push(parseInt('C3', 16)) // ret

	/* Resolve loop start instructions */
	for (const backpatch of backpatches) {
		// Backpatch start
		{
			const left = code.slice(0, backpatch.loop_start - 4)
			const right = code.slice(backpatch.loop_start, code.length)

			const end = backpatch.loop_end - backpatch.loop_start
			const end_i32 = int32ToBytes(end).reverse()

			code = [...left, ...end_i32, ...right]
		}

		// Backpatch end
		{
			const left = code.slice(0, backpatch.loop_end - 4)
			const right = code.slice(backpatch.loop_end, code.length)

			const start = -1 * (backpatch.loop_end - backpatch.loop_start)
			const start_i32 = int32ToBytes(start).reverse()

			code = [...left, ...start_i32, ...right]
		}
	}

	return new Uint8Array(code)
}

function run(code) {
	const ops = parse(code)
	const bin = compile(ops, new ErrorManager(code))

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
