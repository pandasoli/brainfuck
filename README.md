To know how to use read the type annotations.

<br/>

## Interpreter
There is the smallest interpreter [`interpreters/smallest.js`](interpreters/smallest.js).

And the [`interpreters/complete.js`](interpreters/complete.js) with more features for web use cases.
- Yields the result of each char before interpreting it
- Receives a object with the last result to start from

<br/>

## Depreter
> [`depreter.js`](depreter.js)

It translates text to Brainfuck.

<br/>

## Compiler
> [`compiler/compiler.js`](compiler/compiler.js)

Its result can be redirected to a `.s` file,  
then compiled with GAS (GNU Assembly),  
and then ran sending the output to `xxd` to show the result in hex.

**TL;DR**:
```bash
node compiler.js > prog.s
./comp.sh prog && ./prog | xxd
```

<br/>

NOTE: different from [#interpreter](#interpreter) this works with [ASCII](https://ascii-code.com) (0-127), not UTF-16 ([`fromCharCode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)). Each cell is one byte!

<br/>

## Transpreter to GNU Cobol
Soon.
