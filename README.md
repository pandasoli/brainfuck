### Interpreter 🐍
> Inspired by: [Brainfuck/brainfuck-visualizer-master](https://ashupk.github.io/Brainfuck/brainfuck-visualizer-master/index.html)

<br/>

There is the smallest interpreter [`interpreters/smallest.js`](interpreters/smallest.js).

And the [`interpreters/complete.js`](interpreters/complete.js) with more features for web use cases.
- Yields the result of each char before interpreting it
- Receives a object with the last result to start from

<br/>

### Depreter 🔤
> [`depreter.js`](depreter.js)

<br/>

It translates text to Brainfuck.

<br/>

### AS Transpiler 🦬
> [`transpilers/gas`](transpilers/gas)

<br/>

Its output can be redirected to a `.s` file,
compiled with GNU Assembly,
and then ran sending the output to `xxd` to show the result in hex.

```bash
node main.js > prog.s
./comp.sh prog && ./prog | xxd
```

<br/>

❗ Different from [#interpreter](#interpreter-%F0%9F%90%8D) this works with [ASCII](https://ascii-code.com) (0-127), not UTF-16 ([`fromCharCode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)). Each memory cell is 1 byte!

<br/>

### JIT Compiler 😂
> [`compilers/jit`](compilers/jit)  
> Inspired by: [tsoding/bfjit](https://github.com/tsoding/bfjit)

<br/>

It compiles **Brainfuck** to a valid ELF64 format entirely in **JavaScript**, and runs it with a **C** shared library.

Just like [#as-transpiler](#as-transpiler-%F0%9F%A6%AC), it works with ASCII, so be careful.

<br/>

### Transpiler to GNU Cobol 🦖
Soon.
