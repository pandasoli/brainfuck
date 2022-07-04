
document.querySelectorAll("script[type='text/brainfuck']").forEach(_tag => {
  const isSibling = _tag.previousSibling.className === 'div-brainfuck-compatibility'
  let div = document.createElement('div')
  div.className = 'div-brainfuck-compatibility'

  if ( isSibling ) {
    div = _tag.previousSibling
  }

  div.innerText = bfinterpreter( _tag.innerText ).next().value.result

  if ( !isSibling ) {
    _tag.parentElement.insertBefore( div, _tag )
  }
})
