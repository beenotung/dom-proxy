import { createProxy, ProxyNode } from './core'

/** @throws Error if the selector doesn't match any element */
export function queryElement<E extends Element>(
  selector: string,
  parent: ParentNode = document.body,
) {
  let element = parent.querySelector<E>(selector)
  if (!element) throw new Error('failed to find element, selector: ' + selector)
  return element
}

/** @throws Error if the selector doesn't match any element */
export function queryElementProxy<E extends Element>(
  selector: string,
  parent?: ParentNode,
) {
  return createProxy(queryElement<E>(selector, parent))
}

/** @throws Error if any selectors don't match any elements */
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

/** @throws Error if any selectors don't match any elements */
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
