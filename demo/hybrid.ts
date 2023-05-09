import { watch } from '../core'
import { queryElement, queryElementProxies } from '../selector'

// it will throw error if the selector doesn't match any elements.
let loginForm = queryElement('form#loginForm') // infer to be HTMLFormElement
let {
  username, // infer to be ProxyNode<HTMLInputElement>
  password,
  preview, // infer to be ProxyNode<Element>
  reset,
  submit,
} = queryElementProxies(
  {
    username: 'input[name=username]',
    password: 'input[name=password]',
    preview: '#preview',
    reset: 'input[type=reset]',
    submit: 'input[type=submit]',
  },
  loginForm,
)

watch(() => {
  preview.textContent = username.value + ':' + password.value
})

watch(() => {
  reset.disabled = !username.value && !password.value
  submit.disabled = !username.value || !password.value
})

loginForm.addEventListener('submit', event => {
  event.preventDefault()
  alert('mock form submission')
})
