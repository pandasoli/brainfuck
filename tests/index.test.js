const bfinterpreter = require('../interpreter')

let int = bfinterpreter('+.->', {
  mem: [1],
  idx: 1
})

test('.', () => {
  const res = int.next().value
  expect(res.idx).toEqual(1)
})

test('-', () => {
  const res = int.next().value
  expect(res.idx).toEqual(2)
})

test('>', () => {
  const res = int.next().value
  expect(res.idx).toEqual(3)
})


test('A', () => {
  int = bfinterpreter('++++++[>++++++++++<-]>+++++.', {
    mem: [6],
    idx: 6,
    ptr: 0
  }, false)

  const res = int.next()

  expect(res.done).toBeTruthy()
  expect(res.value.res).toBe('A')
  console.log(res)
})

