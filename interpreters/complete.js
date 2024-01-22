/**
 * @typedef {Object} BfResult
 * @property {number[]} mem - The memory array
 * @property {number} ptr - Selected memory index
 * @property {number} i - Current command
 * @property {string} res - The outputed result
 * @property {number[]} loops - The beginning of every started loop
 */

/**
 * @typedef {Object} BfConfig
 * @property {number[]} mem - The memory array
 * @property {number} ptr - Selected memory index
 * @property {number} i - Current command
 * @property {string} res - The outputed result
 * @property {number[]} loops - The beginning of every started loop
 * @property {function(string): string} prompt - Input function
 * @property {boolean} - Pause when found valid character
 */

/**
* @param {string} - Brainfuck code
* @param {BfConfig} - Configuration to start interpretation from & dependencies
* @yields {BfResult}
* @returns {BfResult}
*/
module.exports = function * bfinterpreter(code = '', config = {}) {
  const mem = config.mem ?? [0]
  const loops = config.loops ?? []
  let ptr = config.ptr ?? 0
  let res = config.res ?? ''

  for (var i = config.i ?? 0; i < code.length; i++)
    do {
      const ch = code[i]
      if (config.pause && '+-><.,![]'.includes(ch)) yield { mem, ptr, i, res, loops }

      if      (ch == '+') mem[ptr] = mem[ptr] == 255 ? 0   : mem[ptr] + 1
      else if (ch == '-') mem[ptr] = mem[ptr] == 0   ? 255 : mem[ptr] - 1
      else if (ch == '>') ptr++; if (ptr >= mem.length) mem.push(0)
      else if (ch == '<') ptr--; if (ptr == -1) throw new RangeError('Error: pointer cannot be less than 1')
      else if (ch == '.') res += String.fromCharCode( mem[ptr] )
      else if (ch == ',') mem[ptr] = (config.prompt ?? prompt('enter a ch:')).charCodeAt(0)
      else if (ch == '!') return { mem, ptr, i, res, loops }
      else if (ch == '[') loops.unshift(i)
      else if (ch == ']') mem[ptr] == 0 ? loops.shift() : i = loops[0]
    }
    while (loops.length > 0 && i++)

  return { mem, ptr, i, res, loops }
}
