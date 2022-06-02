## brainfuck-interpreter.js
Ele contem a função de interpretar o brainfuck para algo legível.
Como usar:

### instanciação
```javascript
bf_text(_code, _pause, _getChar)
```
<br/>

Exemplo:
```javascript
const interpreter = bf_text(
  '++++++[>++++++++++<-]>+++++.',
  false
  () => prompt('Enter a char: ')
)
```
> undefined

Nenhum dos parâmetros são obrigatórios

### modo de uso
<br/>
Se a pausa for true o função irá parar em cada carácter aceito
encontrado e ao fim de seu processamento, para continuar e ir
para o proximo carácter, basta:

```javascript
interpreter.next()
```
> {value: {…}, done: false}

Caso contrario o programa continuará normalmente após um .next()
até o fim da interpretação.

Os dados da interpretação são dados a cada .next() eles se
encontram na chave value ela contem a memoria, o ponteiro e
o resultado até agora.

## brainfuck-depreter.js
Este contem a função de converter textos para brainfuck, ele
pode gerar códigos bastante grandes pois trabalha apenas com
dois vetores de memoria, pois a grande parte dos interpretadores
trabalha com uma contia limitada de vetores. Como usar:

### instanciação
### &emsp;&emsp; text_bf(_text, _pause)
<br/>

Exemplo:
```javascript
const interpreter = text_bf(
  'A',
  false
)
```
> text_bf {<suspended>}

Nenhum dos parâmetros são obrigatórios

### modo de uso
<br/>
Se a pausa for true o função irá parar em cada carácter encontrado,
para continuar e ir para o proximo carácter, basta:

```javascript
interpreter.next()
```
> {value: {…}, done: false}

Caso contrario o programa continuará normalmente após um .next()
até o fim da interpretação.

Os dados da interpretação são dados a cada .next() eles se
encontram na chave value ela contem a memoria e o resultado
até agora.
