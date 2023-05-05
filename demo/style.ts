import { text, watch } from '../core'
import { div } from '../helpers'

let timeText = text(0)
let unitText = text()
let classText = text()

let box = div(
  {
    style: {
      maxWidth: 'fit-content',
      outline: '1px solid black',
      padding: '0.5rem',
    },
  },
  [timeText, ' ', unitText, ' (class: ', classText, ')'],
)

let startTime = Date.now()

setInterval(() => {
  let t = Math.round((Date.now() - startTime) / 1000)
  timeText.textContent = String(t)
}, 1000)

watch(() => {
  box.className = +timeText.textContent! % 2 === 0 ? 'even' : 'odd'
})

watch(() => {
  classText.textContent = box.className
})

document.body.appendChild(box.node)
