
/*
	_code?: string
	_pause?: 'none' | 'before' | 'after' | 'both'
	_getChar?: () => any
	_maxMem?: number
	_config?: {
		memory?: number[]
		loops?: number[]
		pointer?: number
		result?: string
		index?: number
	}
*/
module.exports = function * bfinterpreter(_code, _pause, _getChar, _maxMem, _config) {
	const props = {
		code: String(_code || '++++++++[>++++++++++<-]>.<+[>++++++++++<-]>+++++++.<+[>++++++++++<-]>+++.----------.---.!').split(''),
		pause: ['none', 'before', 'after', 'both'].includes(_pause) ? _pause : 'before',
		getChar: _getChar || ( () => prompt('enter a char:') ),
		maxMem: Number(_maxMem) || 'auto',
	}
	const memory = _config.memory || [0]
	const acceptedChars = '+-<>.,[]!'
	const loops = _config.loops || []
	let pointer = _config.pointer || 0
	let result = _config.result || ''

	for (let x = _config.index || 0; x < props.code.length; x++)
		do {
			const char = props.code[x]

			if (acceptedChars.includes(char)) {
				if (['before', 'both'].includes(props.pause)) yield { memory, pointer, result, index: x, char, loops }

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
				else if (char === ',') memory[pointer] = props.getChar().charCodeAt(0)
				else if (char === '!') return { memory, pointer, result, index: x, char, loops }
				else if (char === '[') loops.unshift(x)
				else if (char === ']') memory[pointer] === 0 ? loops.shift() : x = loops[0]

				if (['after', 'both'].includes(props.pause)) yield { memory, pointer, result, index: x, char, loops }
			}

		} while (loops.length > 0 && x++)

	return { memory, pointer, result, loops }
}
