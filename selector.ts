import { createProxy, ProxyNode } from './core'

/** @throws Error if the selector doesn't match any element */
export function queryElement<Selector extends string>(
  selector: Selector,
  parent: ParentNode = document.body,
) {
  let element = parent.querySelector<SelectorElement<Selector>>(selector)
  if (!element) throw new Error('failed to find element, selector: ' + selector)
  return element
}

/** @throws Error if the selector doesn't match any element */
export function queryElementProxy<Selector extends string>(
  selector: Selector,
  parent?: ParentNode,
) {
  return createProxy(queryElement<Selector>(selector, parent))
}

/** @throws Error if any selectors don't match any elements */
export function queryElements<
  SelectorDict extends Dict<Selector>,
  Selector extends string,
>(
  selectors: SelectorDict,
  parent: ParentNode = document.body,
): { [P in keyof SelectorDict]: SelectorElement<SelectorDict[P]> } {
  let object: any = {}
  for (let [key, selector] of Object.entries(selectors)) {
    object[key] = queryElement(selector, parent)
  }
  return object
}

/** @throws Error if any selectors don't match any elements */
export function queryElementProxies<
  SelectorDict extends Dict<Selector>,
  Selector extends string,
>(
  selectors: SelectorDict,
  parent: ParentNode = document.body,
): { [P in keyof SelectorDict]: ProxyNode<SelectorElement<SelectorDict[P]>> } {
  let object: any = {}
  for (let [key, selector] of Object.entries(selectors)) {
    object[key] = queryElementProxy(selector, parent)
  }
  return object
}

type SelectorElement<Selector extends string> =
  GetTagName<Selector> extends `${infer TagName}`
    ? TagName extends keyof HTMLElementTagNameMap
      ? HTMLElementTagNameMap[TagName]
      : TagName extends keyof SVGElementTagNameMap
      ? SVGElementTagNameMap[TagName]
      : FallbackSelectorElement<Selector>
    : FallbackSelectorElement<Selector>

type FallbackSelectorElement<Selector extends string> =
  Selector extends `${string}[name=${string}]${string}`
    ? HTMLInputElement
    : Element

type Dict<T> = {
  [key: string]: T
}

type RemoveTail<
  S extends String,
  Tail extends string,
> = S extends `${infer Rest}${Tail}` ? Rest : S

type RemoveHead<
  S extends String,
  Head extends string,
> = S extends `${Head}${infer Rest}` ? Rest : S

type GetTagName<S extends string> = RemoveTail<
  RemoveTail<
    RemoveTail<
      RemoveTail<
        RemoveHead<RemoveHead<S, `${string} `>, `${string}>`>,
        `:${string}`
      >,
      `[${string}`
    >,
    `.${string}`
  >,
  `#${string}`
>
