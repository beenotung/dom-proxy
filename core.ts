export {
  createText as t,
  createText as text,
  createHTMLElement as h,
  createHTMLElement as html,
  createSVGElement as s,
  createSVGElement as svg,
}

export function fragment(nodes: Array<Node | { node: Node } | string>) {
  const fragment = document.createDocumentFragment()
  for (const node of nodes) {
    appendChild(fragment, node)
  }
  return fragment
}

/** @alias t, text */
export function createText(value: string = '') {
  const node = document.createTextNode(value)
  return createProxy(node)
}

let watchFn: (() => void) | null = null

/** @description run once immediately, auto track dependency and re-run */
export function watch(fn: () => void) {
  watchFn = fn
  fn()
  watchFn = null
}

export type CreateProxyOptions = {
  listen?: 'change' | 'input' | false // default 'input'
}

export type ProxyNode<E> = E & { node: E }

function createProxy<E extends object>(
  node: E,
  options?: CreateProxyOptions,
): ProxyNode<E> {
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
  return Object.assign(proxy, { node })
}

export type PartialCreateElement<E> = (
  attrs?: Partial<E & CreateProxyOptions>,
) => ProxyNode<E>

/** @description higher-function, partially applied createHTMLElement */
export function genCreateHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
): PartialCreateElement<HTMLElementTagNameMap[K]> {
  return attrs => createHTMLElement(tagName, attrs)
}

/** @description higher-function, partially applied createSVGElement */
export function genCreateSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): PartialCreateElement<SVGElementTagNameMap[K]> {
  return attrs => createSVGElement(tagName, attrs)
}

/** @alias h, html */
export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrs?: Partial<HTMLElementTagNameMap[K] & CreateProxyOptions>,
) {
  const node = document.createElement<K>(tagName)
  if (attrs) {
    Object.assign(node, attrs)
  }
  return createProxy(node, attrs)
}

/** @alias s, svg */
export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  attrs?: Partial<SVGElementTagNameMap[K] & CreateProxyOptions>,
) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  if (attrs) {
    Object.assign(node, attrs)
  }
  return createProxy(node, attrs)
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
