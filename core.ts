export {
  createText as t,
  createText as text,
  createHTMLElement as h,
  createHTMLElement as html,
  createSVGElement as s,
  createSVGElement as svg,
}

export function fragment(nodes: NodeChild[]) {
  const fragment = document.createDocumentFragment()
  for (const node of nodes) {
    appendChild(fragment, node)
  }
  return fragment
}

/** @alias t, text */
export function createText(value: string | number = '') {
  const node = document.createTextNode(value as string)
  return createProxy(node)
}

export type WatchOptions = {
  listen?: 'change' | 'input' | false // default 'input'
}

let watchFn: (() => void) | undefined
let watchOptions: WatchOptions | undefined

/** @description run once immediately, auto track dependency and re-run */
export function watch(fn: () => void, options?: WatchOptions) {
  watchFn = fn
  watchOptions = options
  fn()
  watchFn = undefined
  watchOptions = undefined
}

export type ProxyNode<E> = E & { node: E }

let resetTimer: ReturnType<typeof setTimeout> | null = null
const resetFns = new Set<() => void>()
function resetTimeout() {
  for (let fn of resetFns) {
    try {
      fn()
    } catch (error) {
      console.error(error)
    }
  }
  resetFns.clear()
  resetTimer = null
}

const proxySymbol = Symbol('proxy')

function toPropertyKey(p: string) {
  return p === 'value' || p === 'valueAsNumber' || p === 'valueAsDate'
    ? 'value'
    : p
}

export function createProxy<E extends Node>(node: E): ProxyNode<E> {
  if (proxySymbol in node) {
    return (node as any)[proxySymbol]
  }
  const deps = new Map<string, Set<() => void>>()
  const proxy = new Proxy(node, {
    get(target, p, receiver) {
      const listenEventType = watchOptions?.listen ?? 'input'
      if (listenEventType && watchFn && typeof p === 'string') {
        const key = toPropertyKey(p)
        const fn = watchFn
        if (key === 'value' || key === 'checked') {
          target.addEventListener(
            listenEventType,
            // wrap the function to avoid the default behavior be cancelled
            // if the inline-function returns false
            () => fn(),
          )
          ;(target as Node as HTMLInputElement).form?.addEventListener(
            'reset',
            () => {
              resetFns.add(fn)
              if (resetTimer) return
              resetTimer = setTimeout(resetTimeout)
            },
          )
        }
        let fns = deps.get(key)
        if (!fns) {
          fns = new Set()
          deps.set(key, fns)
        }
        fns.add(fn)
      }
      const value = target[p as keyof E]
      if (typeof value === 'function') {
        return value.bind(target)
      }
      return value
    },
    set(target, p, value, receiver) {
      target[p as keyof E] = value
      if (typeof p === 'string') {
        const key = toPropertyKey(p)
        const fns = deps.get(key)
        if (fns) {
          for (const fn of fns) {
            fn()
          }
        }
      }
      return true
    },
  })
  return ((node as any)[proxySymbol] = Object.assign(proxy, { node }))
}

export type NodeChild = Node | { node: Node } | string | number

export type Properties<E extends Node> = Partial<{
  [P in keyof E]?: E[P] extends object ? Partial<E[P]> : E[P]
}>

export type PartialCreateElement<E extends Node> = (
  props?: Properties<E>,
  children?: NodeChild[],
) => ProxyNode<E>

/** @description higher-function, partially applied createHTMLElement */
export function genCreateHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
): PartialCreateElement<HTMLElementTagNameMap[K]> {
  return (props, children) => createHTMLElement(tagName, props, children)
}

/** @description higher-function, partially applied createSVGElement */
export function genCreateSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): PartialCreateElement<SVGElementTagNameMap[K]> {
  return (props, children) => createSVGElement(tagName, props, children)
}

/** @alias h, html */
export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props?: Properties<HTMLElementTagNameMap[K]>,
  children?: NodeChild[],
) {
  const node = document.createElement<K>(tagName)
  applyAttrs(node, props, children)
  return createProxy(node)
}

/** @alias s, svg */
export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  props?: Properties<SVGElementTagNameMap[K]>,
  children?: NodeChild[],
) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  applyAttrs(node, props, children)
  return createProxy(node)
}

function applyAttrs<E extends ParentNode>(
  node: E,
  props?: Properties<E>,
  children?: NodeChild[],
) {
  if (props) {
    for (let p in props) {
      let value = props[p]
      if (value !== null && typeof value === 'object' && p in node) {
        Object.assign((node as any)[p], value)
      } else {
        ;(node as any)[p] = value
      }
    }
  }

  if (children) {
    for (const child of children) {
      appendChild(node, child)
    }
  }
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
