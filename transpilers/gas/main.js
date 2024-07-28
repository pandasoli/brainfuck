/**
 * @typedef {Object} Token
 * @property {string} literal - Token's string representation
 * @property {number} times - How many times token repeated
 */

/**
 * @param {string} code Brainfuck code
 * @returns {Token[]} return Tokens
 */
function lex(code) {
	const tokens = []

	for (const ch of code) {
		if (!'+-><.,![]'.includes(ch)) continue

		if (tokens.length > 0 && tokens[tokens.length - 1].literal === ch)
			tokens[tokens.length - 1].times++
		else
			tokens.push({ literal: ch, times: 1 })
	}

	return tokens
}

/**
 * @param {string} code Brainfuck code
 * @param {number} debug Debug level
 * @return {string} result GNU Assembly code
 */
export function compile_bf(code, debug = 0) {
	let loops_count = 0
	const loops_in = []
	const tokens = lex(code)

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
	 * @param {string} ch
	 * @param {string} chunk
	*/
	const write = (ch, chunk) => {
		const first_line = line =>
			debug == 1 ? `${line}    # ${ch}` :
			debug == 2 ? `# ${ch}\n${line}` :
			line

		result += chunk
			.split('\n')
			.map((el, i) =>
				i === 1
					? first_line(el.trim())
					: el.trim())
			.join('\n').split('\n') // split at \n first_line added
			.filter(el => el) // remove blank lines
			.map(el => '\t'.repeat(1 + loops_in.length) + el) // add identation
			.join('\n') + '\n'

		if (debug === 2) result += '\n'
	}

	for (const token of tokens) {
		const ch = token.literal

		switch (ch) {
			case '+':
				write(ch, `
					movl pointer, %eax
					movb (%eax), %bl

					addb $${token.times}, %bl

					mov %bl, (%eax)`)
				break

			case '-':
				write(ch, `
					movl pointer, %eax
					movb (%eax), %bl

					subb $${token.times}, %bl

					mov %bl, (%eax)`)
				break

			case '<':
				write(ch, `
					movl pointer, %eax
					subl $${token.times}, %eax
					movl %eax, pointer`)
				break

			case '>':
				write(ch, `
					movl pointer, %eax
					addl $${token.times}, %eax
					movl %eax, pointer`)
				break

			case '!':
				write(ch, `
					mov $1, %eax
					xor %ebx, %ebx
					int $0x80`)
				break

			case '.':
				write(ch, `
					movl pointer, %ecx

					mov $4, %eax
					mov $1, %ebx
					mov $1, %edx
					int $0x80`)

				Array(token.times - 1).fill(null).forEach(() =>
					write(ch, `
						mov $4, %eax
						int $0x80`)
				)
				break

			case ',':
				write(ch, `
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
				Array(token.times).fill(null).forEach(() => {
					write(ch, `
						movl pointer, %eax
						movb (%eax), %bl

						test %bl, %bl
						jz loop_${loops_count}_end
						loop_${loops_count}_begin:`)

					loops_in.push(loops_count++)
				})
				break

			/*
				Creates the end lable of the loop
				and jumps to the beginning of the
				loop if the current cell is zero
			*/
			case ']':
				Array(token.times).fill(null).forEach(() => {
					const loop_n = loops_in.pop()

					write(ch, `
						movl pointer, %eax
						movb (%eax), %bl

						test %bl, %bl
						jnz loop_${loop_n}_begin
						loop_${loop_n}_end:`)
				})
		}
	}

	return result
}

console.log(
	compile_bf('>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.>++++[<+++++>-]<.[-]+++[>+++++++++++<-]>.-.<+++++[>+++++++++<-]>.<++++[>+++++++++++<-]>.[-]++++[<++++++++>-]<.>++++++[<+++++++++++++>-]<.-------------.++++++++++++.--------.[-]++++[>++++++++<-]>.<++++++++[>+++++++++<-]>+.++++++++++.[-]++++[<++++++++>-]<.>++++++[<++++++>-]<+.>+++[<+++++++++++++>-]<.---.[-]++++[>++++++++<-]>.<++++++[>++++++++<-]>+++.<++++[>+++++++<-]>.---.---.[-]+++[<+++++++++++>-]<.', 2)
)
