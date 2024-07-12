import { bfencoderv2 } from './encoders/encoderv2.js'
import { bfinterpreter } from './interpreters/complete.js'

const bf = bfencoderv2('Brainf*ck').next().value
console.log(bf)

const txt = bfinterpreter(bf.res).next().value
console.log(txt)
