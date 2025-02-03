import { bfencoderv2 } from './encoders/encoderv2.js'
import { bfinterpreter } from './interpreters/complete.js'

const bf = bfencoderv2('Hey! My name is Eli Soli!').next().value
console.log(bf)

const txt = bfinterpreter(bf.res).next().value
console.log(txt)
