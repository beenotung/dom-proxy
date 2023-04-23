export { createElement as c, createText as t }

export function fragment(nodes: Array<Node | { node: Node } | string>) {
  const fragment = document.createDocumentFragment()
  for (const node of nodes) {
    appendChild(fragment, node)
  }
  return fragment
}

export function createText(value: string = '') {
  const node = document.createTextNode(value)
  const proxy = createProxy(node)
  Object.assign(proxy, { node })
  return node
}

let watchFn: (() => void) | null = null

export function watch(fn: () => void) {
  watchFn = fn
  fn()
  watchFn = null
}

export type CreateProxyOptions = {
  listen?: 'change' | 'input' | false // default 'input'
}

function createProxy<E extends object>(
  node: E,
  options?: CreateProxyOptions,
): E {
  const deps = new Map<string, Set<() => void>>()
  const listentEventType = options?.listen ?? 'input'
  const proxy = new Proxy(node, {
    get(target, p, receiver) {
      const value = (target as any)[p]
      if (listentEventType && watchFn && typeof p === 'string') {
        const key =
          p === 'value' || p === 'valueAsNumber' || p === 'valueAsDate'
            ? 'value'
            : p
        const fn = watchFn
        if (key === 'value') {
          ;(target as HTMLInputElement).addEventListener(
            listentEventType,
            // wrap the function to avoid the default behavior be cancelled
            // if the inline-function returns false
            () => fn(),
          )
        }
        let fns = deps.get(key)
        if (!fns) {
          fns = new Set()
          deps.set(key, fns)
        }
        fns.add(fn)
      }
      if (typeof value === 'function') {
        return value.bind(target)
      }
      return value
    },
    set(target, p, value, receiver) {
      ;(target as any)[p] = value
      if (typeof p === 'string') {
        const fns = deps.get(p)
        if (fns) {
          for (const fn of fns) {
            fn()
          }
        }
      }
      return true
    },
  })
  return proxy
}

export function genCreateElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
) {
  return (attrs?: Partial<HTMLElementTagNameMap[K]> & CreateProxyOptions) =>
    createElement(tagName, attrs)
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrs?: Partial<HTMLElementTagNameMap[K] & CreateProxyOptions>,
) {
  const node = document.createElement<K>(tagName)
  if (attrs) {
    Object.assign(node, attrs)
  }
  const proxy = createProxy(node, attrs)
  return Object.assign(proxy, { node })
}

export function appendChild(
  parent: ParentNode,
  child: Node | { node: Node } | string | number,
) {
  if (typeof child == 'string') {
    parent.appendChild(document.createTextNode(child))
  } else if (typeof child == 'number') {
    parent.appendChild(document.createTextNode(String(child)))
  } else if ('node' in child) {
    parent.appendChild(child.node)
  } else {
    parent.appendChild(child)
  }
}
