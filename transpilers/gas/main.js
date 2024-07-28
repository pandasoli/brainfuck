/**
 * @param {string} code Brainfuck code
 * @return {string} result GNU Assembly code
 */
export function compile_bf(code) {
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
			.join('\n') + '\n' + '\n'

	for (let i = 0; i < code.length; i++) {
		const ch = code[i]

		switch (ch) {
			case '+':
				// if this is the first plus in a sequence (the last char wasn't one),
				// then write the necessary code to increment.
				if (i == 0 || code[i - 1] != '+')
					write(`
						# +
						movl pointer, %eax
						movb (%eax), %bl`)

				// write process
				write('incb %bl')

				// if the next char is not a plus,
				// store the result value into the memory.
				if (i < code.length && code[i + 1] != '+')
					write('mov %bl, (%eax)')
				break

			case '-':
				if (i == 0 || code[i - 1] != '-')
					write(`
						# -
						movl pointer, %eax
						movb (%eax), %bl`)

				write('decb %bl')

				if (i < code.length && code[i + 1] != '-')
					write('mov %bl, (%eax)')
				break

			case '<':
				write(`
					# <
					decb pointer`)
				break

			case '>':
				write(`
					# >
					incb pointer`)
				break

			case '!':
				write(`
					# !
					mov $1, %eax
					xor %ebx, %ebx
					int $0x80`)
				break

			case '.':
				write(`
					# .
					movl pointer, %ecx

					mov $4, %eax
					mov $1, %ebx
					mov $1, %edx
					int $0x80`)
				break

			case ',':
				// if the next char also input in the same cell,
				// there is no need to execute it
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
				break

			/*
				Creates the beginning label of the loop
				and jumps to the end of the loop if the
				curent cell is zero
			*/
			case '[':
				write(`
					# [
					movl pointer, %eax
					movb (%eax), %bl

					test %bl, %bl
					jz loop_${loops_count}_end
					loop_${loops_count}_begin:`)

				loops_in.push(loops_count++)
				break

			/*
				Creates the end lable of the loop
				and jumps to the beginning of the
				loop if the current cell is zero
			*/
			case ']':
				const loop_n = loops_in.pop()

				write(`
					# ]
					movl pointer, %eax
					movb (%eax), %bl

					test %bl, %bl
					jnz loop_${loop_n}_begin
					loop_${loop_n}_end:`)
		}
	}

	return result
}

console.log(
	compile_bf('>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.>++++[<+++++>-]<.[-]+++[>+++++++++++<-]>.-.<+++++[>+++++++++<-]>.<++++[>+++++++++++<-]>.[-]++++[<++++++++>-]<.>++++++[<+++++++++++++>-]<.-------------.++++++++++++.--------.[-]++++[>++++++++<-]>.<++++++++[>+++++++++<-]>+.++++++++++.[-]++++[<++++++++>-]<.>++++++[<++++++>-]<+.>+++[<+++++++++++++>-]<.---.[-]++++[>++++++++<-]>.<++++++[>++++++++<-]>+++.<++++[>+++++++<-]>.---.---.[-]+++[<+++++++++++>-]<.')
)
