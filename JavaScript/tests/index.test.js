const bfinterpreter = require('../interpreter')

let int = bfinterpreter('+.->', 'after', null, null, {
  memory: [1],
  index: 1,
  pointer: 0
})

test('.', () => {
  const res = int.next().value
  expect(res.index).toEqual(1)
})

test('-', () => {
  const res = int.next().value
  expect(res.index).toEqual(2)
})

test('>', () => {
  const res = int.next().value
  expect(res.index).toEqual(3)
})


test('A', () => {
  int = bfinterpreter('++++++[>++++++++++<-]>+++++.', 'none', null, 2, {
    memory: [6],
    index: 6,
    pointer: 0
  })

  const res = int.next()

  expect(res.done).toBeTruthy()
  expect(res.value.result).toBe('A')
  console.log(res)
})


