import { appendChild, text, watch } from '../core'
import { div, form, input, label, p, br, img, select, option } from '../helpers'
import { selectImage } from '@beenotung/tslib/file'
import { compressMobilePhoto } from '@beenotung/tslib/image'

let roleSelect = select({ id: 'role', value: 'student' }, [
  option({ value: 'parent', text: 'Parent' }),
  option({ value: 'teacher', text: 'Teacher' }),
  option({ value: 'student', text: 'Student' }),
])
let usernameInput = input({ id: 'username' })
let passwordInput = input({ id: 'password', type: 'password' })
let confirmPasswordInput = input({ id: 'confirm-password', type: 'password' })
let avatarInput = input({
  id: 'avatar',
  type: 'button',
  value: 'choose an image',
  onclick: selectAvatar,
})
let avatarImg = img({ alt: 'avatar preview' })
avatarImg.style.maxWidth = '100%'
avatarImg.style.maxHeight = '50vh'

let previewText = text()

let isValid = false

watch(() => {
  previewText.textContent =
    `(${roleSelect.value}) ` + usernameInput.value + ':' + passwordInput.value
})

watch(() => {
  isValid = passwordInput.value == confirmPasswordInput.value
  let color = isValid ? 'green' : 'red'
  confirmPasswordInput.style.outline = '3px solid ' + color
})

function inputField(input: HTMLInputElement | HTMLSelectElement) {
  let inputFieldDiv = div({ className: 'input-field' }, [
    label({ textContent: input.id + ': ', htmlFor: input.id }),
    br(),
    input,
  ])
  inputFieldDiv.style.marginBottom = '0.5rem'
  input.style.marginTop = '0.25rem'
  return inputFieldDiv
}

async function selectAvatar() {
  console.log('selectAvatar')
  let [file] = await selectImage()
  if (!file) return
  let dataUrl = await compressMobilePhoto({ image: file })
  avatarImg.src = dataUrl
}

function submitForm(event: Event) {
  event.preventDefault()
  if (!isValid) {
    alert('please correct the fields before submitting')
    return
  }
  alert('valid to submit')
}

let signupForm = form({ onsubmit: submitForm }, [
  inputField(roleSelect),
  inputField(usernameInput),
  inputField(avatarInput),
  avatarImg,
  inputField(passwordInput),
  inputField(confirmPasswordInput),
  p(['preview: ', previewText]),
  input({ type: 'submit', value: 'Sign Up' }),
])

appendChild(document.body, signupForm)
