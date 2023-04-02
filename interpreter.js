
/**
* @param {string} code your brainfuck code goes here
* @param {object} config choose or not a config to start from
* @param {boolean} pause pause or not when find a valid character
* @yields {object}
* @returns {object}
*/
module.exports = function * bfinterpreter(code = '', config = {}, pause = true) {
  const mem = config?.mem ?? [0]
  const loops = config?.loops ?? []
  let ptr = config?.ptr ?? 0
  let res = config?.res ?? ''

  for (var idx = config?.idx ?? 0; idx < code.length; idx++)
    do {
      const ch = code[idx]
      if (pause && '+-><.,![]'.includes(ch)) yield { mem, ptr, idx, res, loops }

      if (ch == '+') mem[ptr] = mem[ptr] == 255 ? 0 : mem[ptr] + 1
      else if (ch == '-') mem[ptr] = (mem[ptr] == 0) ? 255 : mem[ptr] - 1
      else if (ch == '>') ptr++; if (ptr >= mem.length) mem.push(0)
      else if (ch == '<') ptr--; if (ptr == -1) throw new RangeError('Error: pointer cannot be less than 1')
      else if (ch == '.') res += String.fromCharCode( mem[ptr] )
      else if (ch == ',') mem[ptr] = (config?.prompt ?? prompt('enter a ch:')).charCodeAt(0)
      else if (ch == '!') return { mem, ptr, idx, res, loops }
      else if (ch == '[') loops.unshift(idx)
      else if (ch == ']') mem[ptr] == 0 ? loops.shift() : idx = loops[0]
    }
    while (loops.length > 0 && idx++)

  return { mem, ptr, idx, res, loops }
}
