import { text, br, input, fragment, p } from '../core'

console.log('ts')

let msg = text('alice')
document.body.append(msg.node)

document.body.append(br())

let name = input({ type: 'text' })
document.body.append(name.node)

name.oninput(value => msg(value))

let a = input()
let b = input()
let c = text('0')

a.oninput(updateC)
b.oninput(updateC)

function updateC() {
  c((+a() || 0) + (+b() || 0))
}

document.body.appendChild(
  fragment([p({ text: 'a + b = c' }), a, ' + ', b, ' = ', c]),
)

document.body.appendChild(p({ text: 'powered by live-dom' }).node)

setInterval(() => {
  msg(msg() + '.')
  // name(msg()?.length?.toString())
}, 1000)
