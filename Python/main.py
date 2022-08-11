
def bfinterpreter(_code):
  memory = [0]
  loops = []
  pointer = 0
  result = ''
  x = 0

  while True:
    while True:
      char = _code[x]

      if char == '+': memory[pointer] = 0 if memory[pointer] == 255 else memory[pointer] + 1
      elif char == '-': memory[pointer] = 255 if memory[pointer] == 0 else memory[pointer] - 1
      elif char == '>':
        pointer += 1
        if pointer >= len(memory): memory.append(0)
      elif char == '<':
        pointer -= 1
        if pointer == -1: raise Exception('[Error] pointer cannot be less than 1')
      elif char == '.': result += chr(memory[pointer])
      elif char == ',': memory[pointer] = ord(input('Enter a char: '))
      elif char == '!': return { 'memory': memory, 'pointer': pointer, 'result': result, 'loops': loops }
      elif char == '[': loops.insert(0, x)
      elif char == ']':
        if memory[pointer] == 0: loops.pop(0)
        else: x = loops[0]

      if len(loops) == 0: break
      else: x += 1

    x += 1
    if x == len(_code): break

  return { 'memory': memory, 'pointer': pointer, 'result': result, 'loops': loops }
