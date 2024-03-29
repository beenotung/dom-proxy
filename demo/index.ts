import { text, fragment, watch } from '../core'
import { h1, a, p, code, h2, input, label, br, button } from '../helpers'

console.log('ts')
console.time('init')

document.body.appendChild(
  h1([
    'dom-proxy demo',
    a({ textContent: 'git', href: 'https://github.com/beenotung/dom-proxy' }),
    a({ textContent: 'npm', href: 'https://www.npmjs.com/package/dom-proxy' }),
  ]).node, // get the native element from .node property
  // (only necessary when not wrapped by fragment helper function)
)

document.body.appendChild(
  p([
    "This interactive page is created entirely in Typescript using dom-proxy's creation helper functions and auto-tracking ",
    code({ textContent: 'watch()' }),
    ' function.',
  ]).node,
)

let upTimeText = text(0)

let startTime = Date.now()
setInterval(() => {
  upTimeText.textContent = ((Date.now() - startTime) / 1000).toFixed(0)
}, 500)

document.body.appendChild(
  fragment([h2({ textContent: 'up time' }), upTimeText, ' seconds']),
)

let nameInput = input({
  placeholder: 'guest',
  id: 'visitor-name',
})
let nameText = text()
let greetDotsText = text()

// the read-dependencies are tracked automatically
watch(
  () => {
    nameText.textContent = nameInput.value || nameInput.placeholder
  },
  { listen: 'change' },
)
watch(() => {
  let n = +upTimeText.textContent! % 5
  greetDotsText.textContent = '.'.repeat(n)
})

document.body.appendChild(
  // use a DocumentFragment to contain the elements
  fragment([
    h2({ textContent: 'change event demo' }),
    label({ textContent: 'name: ', htmlFor: nameInput.id }),
    nameInput,
    p(['hello, ', nameText, greetDotsText]),
  ]),
)

let aInput = input({ type: 'number', value: '0' })
let bInput = input({
  type: 'number',
  value: '0',
  readOnly: true,
  disabled: true,
})
let cInput = input({
  type: 'number',
  value: '0',
  readOnly: true,
  disabled: true,
})

watch(() => {
  bInput.value = upTimeText.textContent!
})

watch(() => {
  cInput.value = String(aInput.valueAsNumber + bInput.valueAsNumber)
})

let aText = text()
let bText = text()
let cText = text()

watch(() => (aText.textContent = String(aInput.valueAsNumber)))
watch(() => (bText.textContent = String(bInput.valueAsNumber)))
watch(() => (cText.textContent = String(cInput.valueAsNumber)))

let resetButton = button({ textContent: 'reset', onclick: reset })

watch(() => {
  resetButton.disabled = aInput.valueAsNumber === 0
})

function reset() {
  aInput.value = '0'
}

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

document.body.appendChild(
  fragment([
    h2({ textContent: 'more demo' }),
    a({ href: 'signup.html', textContent: 'signup.html' }),
    ', ',
    a({ href: 'hybrid.html', textContent: 'hybrid.html' }),
    ', ',
    a({ href: 'style.html', textContent: 'style.html' }),
  ]),
)

console.timeEnd('init')
