/**
 * @typedef {Object} Token
 * @property {string} literal Token's string representation
 * @property {number} times How many times token repeated
 */

/**
 * @param {string} code Brainfuck code
 * @returns {Token[]} return Tokens
 */
const lex = code => {
	/** @type {Token[]} */ const tokens = []

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
 * @param {string} bf Brainfuck code
 */
export const transpile = bf => {
	let loops_count = 0
	const loops_in = []

	const codes = {
		'+': times => `addb $${times}, (%rdi)`,
		'-': times => `subb $${times}, (%rdi)`,
		'<': times => `sub $${times}, %rdi`,
		'>': times => `add $${times}, %rdi`,
		'!': _ => `ret`,
		'.': times => {
			const code = `
				push %rdi

				mov $1, %rax
				mov %rdi, %rsi
				mov $1, %rdi
				mov $1, %rdx
				syscall

				pop %rdi
			`

			return code.repeat(times)
		},
		',': _ => `
			push %rdi

			mov $0, %rax
			mov %rdi, %rsi
			mov $0, %rdi
			mov $1, %rdx
			syscall

			pop %rdi
		`,
		'[': times =>
			[...Array(times)]
			.map(() => {
				const n = loops_count++
				loops_in.push(loops_count)

				return `
					cmpb $0, (%rdi)
					jz .loop_${n}_end
					loop_${n}_begin:
				`
			})
			.join('')
		,
		']': times =>
			[...Array(times)]
			.map(() => {
				const n = loops_in.pop() - 1

				return `
					cmpb $0, (%rdi)
					jnz loop_${n}_begin
					.loop_${n}_end:
				`
			})
			.join('')
	}

	return lex(bf).flatMap(e =>
		codes[e.literal](e.times)
			.split('\n')
			.map(e => e.trim())
			.filter(e => e)
	)
	.join('\n')
}
