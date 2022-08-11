
def bfinterpreter(_code)
  memory = [0]
  loops = []
  pointer = 0
  result = ''
  x = 0

  while true do
    while true do
      char = _code[x]

      if char == '+'
        memory[pointer] = if memory[pointer] == 255 then 0 else memory[pointer] + 1 end
      elsif char == '-'
        memory[pointer] = if memory[pointer] == 0 then 255 else memory[pointer] - 1 end
      elsif char == '>'
        pointer += 1
        if pointer >= memory.length
          memory.push(0)
        end
      elsif char == '<'
        pointer -= 1
        if pointer == -1
          raise Exception('[Error] pointer cannot be less than 1')
        end
      elsif char == '.'
        result += memory[pointer].chr
      elsif char == ','
        print('Enter a char: ')
        memory[pointer] = gets.chomp[0].ord
      elsif char == '!'
        return [ 'memory' => memory, 'pointer' => pointer, 'result' => result, 'loops' => loops ]
      elsif char == '['
        loops.unshift(x)
      elsif char == ']'
        if memory[pointer] == 0
          loops.pop(0)
        else
          x = loops[0]
        end
      end

      if loops.length == 0
        break
      else
        x += 1
      end
    end

    x += 1
    if x == _code.length
      break
    end
  end

  return [ 'memory' => memory, 'pointer' => pointer, 'result' => result, 'loops' => loops ]
end

puts bfinterpreter('++++++[>++++++++++<-]>+++++.')
