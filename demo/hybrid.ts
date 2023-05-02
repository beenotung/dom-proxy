import { ProxyNode, watch } from '../core'
import { queryElement, queryElementProxies } from '../selector'

// it will throw error if the selector doesn't match any elements.
let loginForm = queryElement<HTMLFormElement>('#loginForm')
let elements = queryElementProxies(
  {
    username: '[name=username]',
    password: '[name=password]',
    preview: '#preview',
    reset: '[type=reset]',
    submit: '[type=submit]',
  },
  loginForm,
)
const preview = elements.preview
const username = elements.username as ProxyNode<HTMLInputElement>
const password = elements.password as ProxyNode<HTMLInputElement>
const reset = elements.reset as ProxyNode<HTMLInputElement>
const submit = elements.submit as ProxyNode<HTMLInputElement>

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
