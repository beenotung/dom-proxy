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

This example consists of a input and text message.

With the `watch()` function, the text message is initialied and updated according to the input value. We don't need to specify the dependency explicitly.

More examples can be found in [./demo/index.ts](demo/index.ts)

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

## Typescript Signature

The types shown in this section are simplified, see the `.d.ts` files published in the npm package for complete types.

### Reactive function

```typescript
/** run once immediately, auto track dependency and re-run */
function watch(fn: Function): void
```

### Creation functions

```typescript
function fragment(nodes: NodeChild[]): DocumentFragment

/** @alias t, text */
function createText(value?: string | number): ProxyNode<Text>

/** @alias h, html */
function createHTMLElement<K, Element>(
  tagName: K,
  attrs?: Partial<Element> & CreateProxyOptions,
  children?: NodeChild[],
): ProxyNode<Element>

/** @alias s, svg */
function createSVGElement<K, SVGElement>(
  tagName: K,
  attrs?: Partial<SVGElement> & CreateProxyOptions,
  children?: NodeChild[],
): ProxyNode<SVGElement>

function createProxy<E extends Node>(
  node: E,
  options?: CreateProxyOptions,
): ProxyNode<E>
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

type PartialCreateElement<E> = (
  attrs?: Partial<E> & CreateProxyOptions,
  children?: NodeChild[],
) => ProxyNode<E>
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

### Helper functions

The creation function of some commonly used elements are defined as partially applied createHTMLElement.

If you need more helper functions, you can defined them with `genCreateHTMLElement(tagName)` or `genCreateSVGElement(tagName)`

```typescript
const br: PartialCreateElement<HTMLBRElement>
const p: PartialCreateElement<HTMLParagraphElement>
const a: PartialCreateElement<HTMLAnchorElement>
const input: PartialCreateElement<HTMLInputElement>
const label: PartialCreateElement<HTMLLabelElement>
const span: PartialCreateElement<HTMLSpanElement>
const button: PartialCreateElement<HTMLButtonElement>
const h1: PartialCreateElement<HTMLHeadingElement>
const h2: PartialCreateElement<HTMLHeadingElement>
const h3: PartialCreateElement<HTMLHeadingElement>
const h4: PartialCreateElement<HTMLHeadingElement>
const h5: PartialCreateElement<HTMLHeadingElement>
const h6: PartialCreateElement<HTMLHeadingElement>
const b: PartialCreateElement<HTMLElement>
const i: PartialCreateElement<HTMLElement>
const img: PartialCreateElement<HTMLImageElement>
const audio: PartialCreateElement<HTMLAudioElement>
const video: PartialCreateElement<HTMLVideoElement>
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
