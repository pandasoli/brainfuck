import { dlopen } from 'bun:ffi'

import { compile } from './compiler.js'
import { transpile } from './transpiler.js'

/**
 * @param {string} bf Brainfuck code
 */
export const run = bf => {
	const asm = transpile(bf)
	const bin = compile(asm)

	if (!bin) return

	// Load the C library
	const path = './main.so'

	// const dylib = Deno.dlopen(
	const dylib = dlopen(
		path,
		{
			run: {
				args: ['buffer', 'u32', 'i32'],
				returns: 'void'
			}
		}
	)

	// Allocate and initialize memory for the data in C
	const buf = new Uint8Array(bin.length)

	for (let i = 0; i < bin.length; i++)
		buf[i] = bin[i]

	// Call the C function
	dylib.symbols.run(buf, bin.length, 255)
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
