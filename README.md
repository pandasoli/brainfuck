<div align='center'>

[![Brainfuck.org logo](doc/logo.png)](brainfuck-org.vercel.app)
<br/><br/>

[ASCII Table PDF](doc/ASCII%20Table.pdf)

# Interpreter
Ele contem a função de interpretar o brainfuck para algo legível.

<div align='left'>

  ```js
  const interpreter = bfinterpreter(
    '++++++[>++++++++++<-]>+++++.', // Código
    'after',                        // Pausar após interpretar cada caracter
    2                               // Quantidade máxima de vetores na memória
  )
  ```
</div>

### Parametros
<div align='left'>

```ts
  type Props = {
    _code?: string
    _pause?: 'none' | 'before' | 'after' | 'both'
    _getChar?: () => any
    _maxMem?: number
    _config?: {
      memory?: number[]
      loops?: number[]
      pointer?: number
      result?: string
      index?: number
    }
  }

  type OnFoundChar = {
    memory: number[]
    pointer: number
    result: string
    index: number
    char: string
    loops: number[]
  }

  type Response = {
    memory: number[]
    pointer: number
    result: string
    loops: number[]
  }
```
</div>

### Nenhum dos parâmetros são obrigatórios!
A função recebe paramtetros de teste por padrão, não sendo necessarío que você os passe.

### Modo de uso
Se o parâmetro "_pause" ser "none" a função não irá pausar quando encontrar um caracter.  
Se for "before", vai parar antes de processar este caracter.  
Se for "after" depois de processar.  
E se for "both" será antes e depois.

Caso não tenha ficado claro o parâmetro "_config", ele serve para iniciar o interpretador  
com base nos valores passados, como se os valores passados fossem de uma interpretação  
passada que foi parada mas você ainda tem os últimos valores recebidos.


# Depreter
Este contem a função de converter textos para brainfuck, ele  
pode gerar códigos bastante grandes pois trabalha apenas com  
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

Nenhum dos parâmetros são obrigatórios!

</div>