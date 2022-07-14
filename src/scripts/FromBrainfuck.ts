
type Props = {
	code: string[]
	pause: boolean
	warn: boolean
	getChar: () => string
	maxMem: 'auto' | number
}


function * From(_code?: string, _pause?: boolean, _warn?: boolean, _getChar?: () => string, _maxMem?: number) {
	const props: Props = {
		code: String(_code || '++++++++[>++++++++++<-]>.<+[>++++++++++<-]>+++++++.<+[>++++++++++<-]>+++.----------.---.!').split(''),
		pause: Boolean(_pause),
		warn: Boolean(_warn),
		getChar: _getChar || ( () => prompt('enter a char:') || '' ),
		maxMem: Number(_maxMem) > 0 ? Number(_maxMem)  : 'auto'
	}
	// const memory = props.maxMem === 'auto' ? [0] : Array(props.maxMem).fill('').map(_item => 0)
	const memory = [0]
	const acceptedChars = '+-<>.,[]!'
	const loops = []
	const warnings = []
	let pointer = 0
	let result = ''

	for (let x = 0; x < props.code.length; x++) {
		do {
			const char = props.code[x]

			if (acceptedChars.includes(char)) {
				const resToReturn = { memory, pointer, result, index: x, char, loops, error: '', warning: '' }

				if (props.pause) { yield resToReturn }

				if (char === '+') {
					if (props.warn && memory[pointer] === 255) {
						resToReturn.warning = 'Warning: memory passed 255.'
						warnings.push({
							index: x,
							warning: resToReturn.warning
						})

						if (props.pause) {
							yield resToReturn
						}
					}

					memory[pointer] = memory[pointer] === 255 ? 0 : memory[pointer] + 1
				}
				else if (char === '-') {
					if (props.warn && memory[pointer] === 0) {
						resToReturn.warning = 'Warning: memory passed 0.'
						warnings.push({
							index: x,
							warning: resToReturn.warning
						})

						if (props.pause) {
							yield resToReturn
						}
					}

					memory[pointer] = memory[pointer] === 0 ? 255 : memory[pointer] - 1
				}

				else if (char === '>') {
					pointer++

					if (pointer === memory.length) {
						if (props.maxMem === 'auto' || memory.length < props.maxMem) {
							memory.push(0)
						}
						else {
							memory.push(0)
							resToReturn.error = `Error: memory cannot pass '${props.maxMem}' arrays.`
							return resToReturn
						}
					}
				}
				else if (char === '<') {
					pointer--

					if (pointer === -1) {
						resToReturn.error = 'Error: pointer cannot be less than 1.'
						return { ...resToReturn, warnings }
					}
				}
				else if (char === '.') { result += String.fromCharCode( memory[pointer] ) }
				else if (char === ',') { memory[pointer] = props.getChar().charCodeAt(0) }
				else if (char === '!') { return resToReturn }
				else if (char === '[') { loops.unshift(x) }
				else if (char === ']') { (memory[pointer] === 0) ? loops.shift() : x = loops[0] }

				if (props.pause && !resToReturn.warning) { yield resToReturn }
			}

		} while (loops.length > 0 && x++)
	}

	return { memory, pointer, result, loops, warnings }
}

export default From