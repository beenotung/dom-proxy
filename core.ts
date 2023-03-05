export function text(value: string) {
  let node = document.createTextNode(value)
  node.addEventListener('change', e => {
    console.log(node)
  })
  function f(value: string | number): void
  function f(): string
  function f(value?: string | number) {
    if (arguments.length === 0) {
      return node.nodeValue
    }
    node.nodeValue = value as string
  }
  return Object.assign(f, { node })
}

export function input(options?: { type?: string; value?: string }) {
  let node = document.createElement('input')
  if (options?.type) node.type = options.type
  if (options?.value) node.value = options.value

  function value(value: string | number): void
  function value(): string
  function value(value?: string | number): string | void {
    if (arguments.length == 0) {
      return node.value
    }
    node.value = value as string
  }
  return Object.assign(value, {
    node,
    oninput: (cb: (value: string) => void) => {
      node.addEventListener('input', () => cb(node.value))
    },
    onchange: (cb: (value: string) => void) => {
      node.addEventListener('change', () => cb(node.value))
    },
  })
}

export function fragment(nodes: Array<Node | { node: Node } | string>) {
  let fragment = document.createDocumentFragment()
  nodes.forEach(node => {
    if (typeof node == 'string') {
      fragment.appendChild(document.createTextNode(node))
    } else if (node instanceof Node) {
      fragment.appendChild(node)
    } else {
      fragment.appendChild(node.node)
    }
  })
  return fragment
}

export function br() {
  return document.createElement('br')
}

export function p(options?: { text?: string }) {
  let node = document.createElement('p')
  if (options?.text) node.textContent = options.text
  function value() {}
  return Object.assign(value, { node })
}
