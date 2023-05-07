import { fragment, text, watch } from '../core'
import { input, label, p } from '../helpers'

let nameInput = input({ placeholder: 'guest', id: 'visitor-name' })
let nameText = text()

// auto re-run when the value in changed
watch(() => {
  nameText.textContent = nameInput.value || nameInput.placeholder
})

document.body.appendChild(
  fragment([
    label({ textContent: 'name: ', htmlFor: nameInput.id }),
    nameInput,
    p({}, ['hello, ', nameText]),
  ]),
)
