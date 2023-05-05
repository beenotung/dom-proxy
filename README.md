# dom-proxy

Develop declarative UI with (opt-in) automatic dependecy tracking without boilerplate code, VDOM, nor compiler.

[![npm Package Version](https://img.shields.io/npm/v/dom-proxy)](https://www.npmjs.com/package/dom-proxy)
[![Minified Package Size](https://img.shields.io/bundlephobia/min/dom-proxy)](https://bundlephobia.com/package/dom-proxy)
[![Minified and Gzipped Package Size](https://img.shields.io/bundlephobia/minzip/dom-proxy)](https://bundlephobia.com/package/dom-proxy)

Demo: https://dom-proxy.surge.sh

## Installation

You can get dom-proxy via npm:

```bash
npm install dom-proxy
```

Then import from typescript using named import or star import:

```typescript
import { watch } from 'dom-proxy'
import * as domProxy from 'dom-proxy'
```

Or import from javascript:

```javascript
var domProxy = require('dom-proxy')
```

You can also get dom-proxy via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-proxy@1/browser.min.js"></script>
<script>
  console.log(typeof domProxy.watch) // function
</script>
```

## Usage Example

More examples can be found in [./demo](./demo):

- [index.ts](./demo/index.ts)
- [signup.ts](./demo/signup.ts)
- [hybrid.html](./demo/hybrid.html) + [hybrid.ts](./demo/hybrid.ts)

### Example using creation functions

This example consists of a input and text message.

With the `watch()` function, the text message is initialied and updated according to the input value. We don't need to specify the dependency explicitly.

```typescript
import { watch, input, span, label, fragment } from 'dom-proxy'

let nameInput = input({ placeholder: 'guest', id: 'visitor-name' })
let nameSpan = span()

watch(() => {
  // the read-dependencies are tracked automatically
  nameSpan.textContent = nameInput.value || nameInput.placeholder
})

document.body.appendChild(
  fragment([
    // use a DocumentFragment to contain the elements
    label({ textContent: 'name: ', htmlFor: nameInput.id }),
    nameInput,
    p({}, ['hello, ', nameSpan]),
  ]),
)
```

### Example using selector functions

This example query and proxy the existing elements from the DOM, then setup interactive logics in the `watch()` function.

If the selectors don't match any element, it will throw error.

```typescript
import { ProxyNode, watch } from 'dom-proxy'
import { queryElement, queryElementProxies } from 'dom-proxy'

let loginForm = queryElement<HTMLFormElement>('#loginForm')
let elements = queryElementProxies(
  {
    username: '[name=username]',
    password: '[name=password]',
    preview: '#preview',
    reset: '[type=reset]',
    submit: '[type=submit]',
  },
  loginForm,
)
const preview = elements.preview
const username = elements.username as ProxyNode<HTMLInputElement>
const password = elements.password as ProxyNode<HTMLInputElement>
const reset = elements.reset as ProxyNode<HTMLInputElement>
const submit = elements.submit as ProxyNode<HTMLInputElement>

watch(() => {
  preview.textContent = username.value + ':' + password.value
})

watch(() => {
  reset.disabled = !username.value && !password.value
  submit.disabled = !username.value || !password.value
})
```

## Typescript Signature

The types shown in this section are simplified, see the `.d.ts` files published in the npm package for complete types.

### Reactive function

```typescript
/** run once immediately, auto track dependency and re-run */
function watch(fn: Function): void
```

### Selector functions

These query selector functions will throw error if no elements match the selectors.

```typescript
function queryElement<Element>(selector: string, parent?: ParentNode): Element

function queryElementProxy<Element>(
  selector: string,
  parent?: ParentNode,
): ProxyNode<Element>

function queryElements<K, Element>(
  selectors: Record<K, string>,
  parent?: ParentNode,
): Record<K, Element>

function queryElementProxies<K, Element>(
  selectors: Record<K, string>,
  parent?: ParentNode,
): Record<K, ProxyNode<Element>>
```

### Creation functions

```typescript
function fragment(nodes: NodeChild[]): DocumentFragment

/** @alias t, text */
function createText(value?: string | number): ProxyNode<Text>

/** @alias h, html */
function createHTMLElement<K, Element>(
  tagName: K,
  attrs?: Properties<Element> & CreateProxyOptions,
  children?: NodeChild[],
): ProxyNode<Element>

/** @alias s, svg */
function createSVGElement<K, SVGElement>(
  tagName: K,
  attrs?: Properties<SVGElement> & CreateProxyOptions,
  children?: NodeChild[],
): ProxyNode<SVGElement>

function createProxy<Node>(
  node: Node,
  options?: CreateProxyOptions,
): ProxyNode<Node>
```

### Options Types / Output Types

```typescript
type ProxyNode<E> = E & {
  node: E
}

type NodeChild = Node | ProxyNode | string | number

type CreateProxyOptions = {
  listen?: 'change' | 'input' | false
}

type Properties<E> = Partial<{
  [P in keyof E]?: E[P] extends object ? Partial<E[P]> : E[P]
}>

type PartialCreateElement<Element> = (
  attrs?: Properties<Element> & CreateProxyOptions,
  children?: NodeChild[],
) => ProxyNode<Element>
```

### Partially applied creation functions

These are some high-order functions that helps to generate type-safe creation functions for specific elements with statically typed properties.

```typescript
/** partially applied createHTMLElement */
function genCreateHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
): PartialCreateElement<HTMLElementTagNameMap[K]>

/** partially applied createSVGElement */
function genCreateSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
): PartialCreateElement<SVGElementTagNameMap[K]>
```

### Creation helper functions

The creation function of some commonly used elements are defined as partially applied createHTMLElement.

If you need more helper functions, you can defined them with `genCreateHTMLElement(tagName)` or `genCreateSVGElement(tagName)`

```typescript
// some pre-defined creation helper functions
const div: PartialCreateElement<HTMLDivElement>
const p: PartialCreateElement<HTMLParagraphElement>
const a: PartialCreateElement<HTMLAnchorElement>
const label: PartialCreateElement<HTMLLabelElement>
const input: PartialCreateElement<HTMLInputElement>
// and more ...
```

The complete list of create element helper functions:

br, p, a, div, form, input, label, span, button, h1, h2, h3, h4, h5, h6, b, i, img, audio, video, ol, ul, li, code

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
