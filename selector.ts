import { createProxy, ProxyNode } from './core'

export function queryElement<E extends Element>(
  selector: string,
  parent: ParentNode = document.body,
) {
  let element = parent.querySelector<E>(selector)
  if (!element) throw new Error('failed to find element, selector: ' + selector)
  return element
}

export function queryElementProxy<E extends Element>(
  selector: string,
  parent?: ParentNode,
) {
  return createProxy(queryElement<E>(selector, parent))
}

export function queryElements<K extends string, E extends Element>(
  selectors: Record<K, string>,
  parent: ParentNode = document.body,
) {
  let object = {} as Record<K, E>
  for (let [key, selector] of Object.entries<string>(selectors)) {
    object[key as K] = queryElement<E>(selector, parent)
  }
  return object
}

export function queryElementProxies<K extends string, E extends Element>(
  selectors: Record<K, string>,
  parent: ParentNode = document.body,
) {
  let object = {} as Record<K, ProxyNode<E>>
  for (let [key, selector] of Object.entries<string>(selectors)) {
    object[key as K] = queryElementProxy<E>(selector, parent)
  }
  return object
}
