
function * bf_text(_code, _pause, _getChar, _maxMem) {
	const props = {
		code: String(_code || '++++++++[>++++++++++<-]>.<+[>++++++++++<-]>+++++++.<+[>++++++++++<-]>+++.----------.---.!').split(''),
		pause: Boolean(_pause),
		getChar: _getChar || ( () => prompt('enter a char:') ),
		maxMem: Number(_maxMem) || 'auto'
	}
	const memory = [0]
	const acceptedChars = '+-<>.,[]!'
	const loops = []
	let pointer = 0
	let result = ''

	for (let x = 0; x < props.code.length; x++)
		do {
			const char = props.code[x]

			if (acceptedChars.includes(char)) {
				const resToReturn = { memory, pointer, result, index: x, char, loops }

				if (props.pause) yield resToReturn

				if (char === '+') memory[pointer] = memory[pointer] === 255 ? 0 : memory[pointer] + 1
				else if (char === '-') memory[pointer] = (memory[pointer] === 0) ? 255 : memory[pointer] - 1
				else if (char === '>') {
          pointer++
          if (pointer === memory.length) {
            if (props.maxMem === 'auto' || memory.length < props.maxMem)
              memory.push(0)
            else
              throw `Error: memory cannot pass '${props.maxMem}' arrays.`
          }
        }
				else if (char === '<') pointer--; if (pointer === -1) throw 'Error: pointer can not be less than 1'
				else if (char === '.') result += String.fromCharCode( memory[pointer] )
				else if (char === ',') memory[pointer] = await props.getChar().charCodeAt(0)
				else if (char === '!') return resToReturn
				else if (char === '[') loops.unshift(x)
				else if (char === ']') memory[pointer] === 0 ? loops.shift() : x = loops[0]

				if (props.pause) yield resToReturn
			}

		} while (loops.length > 0 && x++)

	return { memory, pointer, result, loops }
}
