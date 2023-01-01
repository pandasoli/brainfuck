<div align='center'>

# Interpreter
Ele contem a função de interpretar o brainfuck para algo "legível".

<div align='left'>

  ```js
  const interpreter = bfinterpreter(
    '++++++[>++++++++++<-]>+++++.', // Código
    {},                             // Configurações
    false                           // Puasar quando achar um caractér valido
  )
  ```
</div>

### Parâmetros
Nenhum deles é obrigatório!

`code`: é onde seu código brainfuck é passado
`config`: aquí você pode colocar as configurações iniciais. assim:

<div align='left'>

  ```js
    bfinterpreter('+-.>', {
      mem: [0],     // Como a memoria vai iniciar
      ptr: 0,       // Qual local da memoria o ponteiro vai iniciar (começa em 0)
      idx: 0,       // Qual letra do código iniciar
      prompt: promt('Enter a char:'), // Qual função chamar ao encontrar ","
      loops: []     // Guardar inicio de loops
    })
  ```
</div>
`pause`: pausa a função a cada character valido encontrado

Não é aconcelhavel usar o parâmetro `config` caso você não esteja setando um estado anteriormente salvo.

# Depreter
Este contem a função de converter textos para brainfuck.
ele pode gerar códigos bastante grandes pois trabalha apenas com
dois vetores de memoria, pois a grande parte dos interpretadores
trabalha com uma contia limitada de vetores.

Exemplo:
<div align='left'>

  ```js
  const interpreter = bfdepreter(
    'A',  // Texto
    false // Pausar em cada caracter
  )
  ```
</div>

