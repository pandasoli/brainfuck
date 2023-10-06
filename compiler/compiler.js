/**
 * @param {string} code Brainfuck code
 * @return {string} result GNU Assembly code
 */
function compile_bf(code) {
	let loops_count = 0
	const loops_in = []

	let result = `.data
	pointer: .long memory

.bss
	memory: .space 255
	input: .byte 0

.text
	.globl _start

_start:
`

	/*
	 * @param {string} chunk
	*/
	const write = chunk =>
		result += chunk
			.split('\n')
			.map(el => el.trim())
			.filter(el => el) // remove blank lines
			.map(el => '\t'.repeat(1 + loops_in.length) + el) // add identation
			.join('\n') + '\n'

	for (let i = 0; i < code.length; i++) {
		const ch = code[i]

		/*
			movl pointer, %eax
			movb (%eax), %bl

			incb %bl

			mov %bl, (%eax)
		*/
		if (ch == '+') {
			//- Load environment
			// If this is the first plus in a sequence (the last char wasn't one),
			// then write the necessary code to increment.
			if (i == 0 || code[i - 1] != '+')
				write(`
					# +
					movl pointer, %eax
					movb (%eax), %bl`)

			// Write process
			write('incb %bl')

			//- Unload environment
			// If the next char is not a plus store the result value into the memory.
			if (i < code.length && code[i + 1] != '+')
				write('mov %bl, (%eax)')
		}
		/*
			movl pointer, %eax
			movb (%eax), %bl

			decb %bl

			mov %bl, (%eax)
		*/
		else if (ch == '-') {
			if (i == 0 || code[i - 1] != '-')
				write(`
					# -
					movl pointer, %eax
					movb (%eax), %bl`)

			write('decb %bl')

			if (i < code.length && code[i + 1] != '-')
				write('mov %bl, (%eax)')
		}
		/*
			decb pointer
		*/
		else if (ch == '<') {
			write(`
				# <
				decb pointer`)
		}
		/*
			incb pointer
		*/
		else if (ch == '>') {
			write(`
				# >
				incb pointer`)
		}
		/*
			mov $1, %eax
			xor %ebx, %ebx
			int $0x80
		*/
		else if (ch == '!') {
			write(`
				# !
				mov $1, %eax
				xor %ebx, %ebx
				int $0x80`)
		}
		/*
			movl pointer, %ecx

			mov $4, %eax
			mov $1, %ebx
			mov $1, %edx
			int $0x80
		*/
		else if (ch == '.') {
			write(`
				# .
				movl pointer, %ecx

				mov $4, %eax
				mov $1, %ebx
				mov $1, %edx
				int $0x80`)
		}
		/*
			mov $3, %eax
			mov $0, %ebx
			movl $input, %ecx
			mov $1, %edx
			int $0x80

			# store received value
			movl pointer, %eax

			movb input, %bl
			movb %bl, (%eax)
		*/
		else if (ch == ',') {
			// If the next char also input in the same cell, there is no need to execute it
			if (i < code.length && code[i + 1] == ',')
				continue

			write(`
				# ,
				mov $3, %eax
				mov $0, %ebx
				movl $input, %ecx
				mov $1, %edx
				int $0x80

				# store received value
				movl pointer, %eax

				movb input, %bl
				movb %bl, (%eax)`)
		}
		/*
			loop_n:
		*/
		else if (ch == '[') {
			write(`loop_${loops_count}:`)
			loops_in.push(loops_count)
			loops_count++
		}
		/*
			movl pointer, %eax
			cmpl $0, %eax
			jne loop_n
		*/
		else if (ch == ']') {
			write(`
				# ]
				movl pointer, %eax
				movb (%eax), %bl

				cmpb $0, %bl
				jne loop_${loops_in[loops_in.length - 1]}`)

			loops_in.pop()
		}
	}

	return result
}

console.log(
	compile_bf('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.!')
)
