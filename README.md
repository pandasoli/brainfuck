<div align='center'>

# Interpreter
Ele contem a função de interpretar o brainfuck para algo legível.

Exemplo:
<div align='left'>

  ```javascript
  const interpreter = bfinterpreter(
    '++++++[>++++++++++<-]>+++++.', // Code
    false, // Pause on each character
    () => prompt('Enter a char: ') // On ","
  )
  ```
</div>

Nenhum dos parâmetros são obrigatórios.

## Modo de uso
Se a pausa for true o função irá parar em cada carácter aceito encontrado. Caso contrario o programa continuará normalmente após um.next() até o fim da interpretação.

Os dados da interpretação são dados a cada .next() eles se
encontram na chave value ela contem a memoria, o ponteiro e
o resultado até agora.

# Depreter
Este contem a função de converter textos para brainfuck, ele
pode gerar códigos bastante grandes pois trabalha apenas com
dois vetores de memoria, pois a grande parte dos interpretadores
trabalha com uma contia limitada de vetores.

Exemplo:
<div align='left'>

  ```javascript
  const interpreter = bfdepreter(
    'A', // Text
    false // Pause on each character
  )
  ```
</div>

Nenhum dos parâmetros são obrigatórios.
</div>
