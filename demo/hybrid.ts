import { watch } from '../core'
import { queryElement, queryElementProxies } from '../selector'

// it will throw error if the selector doesn't match any elements.
let loginForm = queryElement('form#loginForm') // infer to be HTMLFormElement <- "form" tag name
let { username, password, showPw, reset, submit } = queryElementProxies(
  {
    username: 'input[name=username]', // infer to be ProxyNode<HTMLInputElement> <- "input" tagName
    password: '[name=password]', // fallback to be ProxyNode<HTMLInputElement> <- "[name=.*]" attribute
    showPw: 'input#show-pw[type=checkbox]',
    reset: 'input[type=reset]',
    submit: 'input[type=submit]',
  },
  loginForm,
)

watch(() => {
  password.type = showPw.checked ? 'text' : 'password'
})

watch(() => {
  reset.disabled = !username.value && !password.value
  submit.disabled = !username.value || !password.value
})

loginForm.addEventListener('submit', event => {
  event.preventDefault()
  alert('mock form submission')
})
