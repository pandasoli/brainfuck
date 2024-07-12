import { bfencoderv2 } from './encoders/encoderv2.js'
import { bfinterpreter } from './interpreters/complete.js'

const bf = bfencoderv2('Hey! My name is Eli Soli!').next().value
console.log(bf)

const txt = bfinterpreter(bf.res, { pause: true })
let txt_val

try {
	let a
	while (!(a = txt.next()).done)
		txt_val = a.value
	txt_val = a.value
}
catch {}
console.log(txt_val)
