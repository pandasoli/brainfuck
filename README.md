### Interpreter 🐍
> Inspired by: [Brainfuck/brainfuck-visualizer-master](https://ashupk.github.io/Brainfuck/brainfuck-visualizer-master/index.html)

There is the smallest interpreter [`interpreters/smallest.js`](interpreters/smallest.js).

And the [`interpreters/complete.js`](interpreters/complete.js) with more features for web use cases.
- Yields the result of each char before interpreting it
- Receives a object with the last result to start from

<br>

```js
const bf = bfinterpreter('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.!', { pause: true })

while (!(a = bf.next()).done)
	console.log(a.value)
```

<br>

### Depreter 🔤
> [`depreter.js`](depreter.js)

It translates text to Brainfuck.

<br>

### Depreter v2 ⛱️
> [`depreterv2.js`](depreterv2.js)  
> Same configuration as [#interpreter 🐍](#interpreter-%F0%9F%90%8D)

A really smart depreter that writes code with the same techniques
I myself use when I manually writing **Brainf#ck**.

It chooses the smallest result from many techniques to get to the number
on the memory with less code as possible.

It uses:
- Search for the cell with the closest number to the number I want,
	so we can have less instructions than we would need starting from zero.
- `><[-]+++++++` and `><[+]-------`  
	This technique is used when the smallest way to get to the number is starting from zero.
- Try creating a new cell to see if the code gets smaller.
- Loops
	- In loops we lock the chosen cell (1st technique) so
		that the counter code doesn't choose it.
	- We choose the smallest factors of the number

> [!NOTE]
> TODOS:
> - Support loops inside loops
> - Support loop counter to contain a loop

<br>

### AS Transpiler 🦬
> [`transpilers/gas`](transpilers/gas)

Its output can be redirected to a `.s` file, compiled with GNU Assembly,
and then ran sending the output to `xxd` to show the result in hex.

```bash
node main.js > prog.s
./comp.sh prog && ./prog | xxd
```

<br>

❗ Different from [#interpreter](#interpreter-%F0%9F%90%8D) this works with [ASCII](https://ascii-code.com) (0-127), not UTF-16 ([`fromCharCode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)). Each memory cell is 1 byte!

<br>

### JIT Compiler 😂
> [`compilers/jit`](compilers/jit)  
> Inspired by: [tsoding/bfjit](https://github.com/tsoding/bfjit)

It compiles **Brainfuck** to a valid ELF64 format entirely in **JavaScript**, and runs it with a **C** shared library.

Just like [#as-transpiler](#as-transpiler-%F0%9F%A6%AC), it works with ASCII, so be careful.

<br>

### Transpiler to GNU Cobol 🦖
Soon.
