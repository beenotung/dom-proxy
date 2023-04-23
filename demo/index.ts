import {
  watch,
  text,
  fragment,
  input,
  br,
  button,
  p,
  span,
  label,
  h1,
  h2,
} from '..'

console.log('ts')
console.time('init')

document.body.appendChild(
  // get the native element from .node property
  // (only necessary when not wrapped by fragment helper function)
  h1({ textContent: 'live-dom demo' }).node,
)

let nameInput = input({ listen: 'change', placeholder: 'guest' })
let nameSpan = span()
watch(() => (nameSpan.textContent = nameInput.value || nameInput.placeholder))

let greetMessage = p()
greetMessage.appendChild(fragment(['hello, ', nameSpan]))
document.body.appendChild(
  fragment([
    h2({ textContent: 'change event demo' }),
    fragment([label({ textContent: 'name: ' }), nameInput]),
    br(),
    greetMessage,
  ]),
)

let aInput = input({ type: 'number', value: '0' })
let bInput = input({ type: 'number', value: '0' })
let cInput = input({
  type: 'number',
  value: '0',
  readOnly: true,
  disabled: true,
})

let aText = text()
let bText = text()
let cText = text()

let resetButton = button({ textContent: 'reset', onclick: reset })

function reset() {
  aInput.value = '0'
  bInput.value = '0'
}

watch(() => {
  cInput.value = String(aInput.valueAsNumber + bInput.valueAsNumber)
})
watch(() => (aText.textContent = String(aInput.valueAsNumber)))
watch(() => (bText.textContent = String(bInput.valueAsNumber)))
watch(() => (cText.textContent = String(cInput.valueAsNumber)))
watch(() => {
  resetButton.disabled =
    aInput.valueAsNumber === 0 && bInput.valueAsNumber === 0
})

document.body.appendChild(
  fragment([
    h2({ textContent: 'input event demo' }),
    aInput,
    ' + ',
    bInput,
    ' = ',
    cInput,
    br(),
    aText,
    ' + ',
    bText,
    ' = ',
    cText,
    br(),
    resetButton,
  ]),
)

console.timeEnd('init')
