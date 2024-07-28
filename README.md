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

### Encoder 🔤
> [`encoders/encoder.js`](encoders/encoder.js)

It translates text to Brainfuck.

<br>

### Encoder v2 ⛱️
> [`encoders/encoderv2.js`](encoders/encoderv2.js)  
> Same configuration as [#interpreter 🐍](#interpreter-)

A really smart encoder that writes code with the same techniques
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
> Limitations:
> - No support for loops inside loops
> - No support for loop counter to contain a loop
>
> They aren't really needed as all the techniques  
> already make the code as small as possible.

<br>

### AS Transpiler 🦬
> [`transpilers/gas`](transpilers/gas)

Its output can be redirected to a `.s` file, compiled with GNU Assembly,
and then ran sending the output to `xxd` to show the result in hex.

```bash
deno task transpile && \ # send the output of main.js to prog.s
deno task compile && \   # compile prog.s to prog.o
deno task link && \      # link prog.o to prog
deno task run            # run prog
```

> [!WARNING]
> The byte-size this implementation works with is 0-255 (not 0-127 as the others).  
> It was made to keep the code smaller and easier to read.  
> And it means generated code by [#encoderv2](#encoder-v2-) cannot be ran with this.

> [!NOTE]
> TODOS:
> - Let next operators know what's inside registers
>   not to re-set it to the same thing.

<br>

### JIT Compiler 🐱
> [`compilers/jit`](compilers/jit)  
> Inspired by: [tsoding/bfjit](https://github.com/tsoding/bfjit)

It compiles **Brainfuck** to a valid ELF64 format entirely in **JavaScript**, and runs it with a **C** shared library.

> [!WARNING]
> Just like [#as-transpiler](#as-transpiler-), it works with 0-255 byte-size, so be careful.

<br>

### Transpiler to GNU Cobol 🦖
Soon.
