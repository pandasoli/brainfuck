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
	const libSuffix =
		Deno.build.os === 'windows' ? 'dll' :
		Deno.build.os === 'darwin'  ? 'dylib' :
		'so'
	const libName = `./main.${libSuffix}`

	const dylib = Deno.dlopen(
		libName,
		{
			run: {
				parameters: ['buffer', 'u32', 'i32'],
				result: 'void'
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
