# dom-proxy

Develop lightweight and declarative UI with automatic dependency tracking in Javascript/Typescript without boilerplate code, VDOM, nor compiler.

[![npm Package Version](https://img.shields.io/npm/v/dom-proxy)](https://www.npmjs.com/package/dom-proxy)
[![Minified Package Size](https://img.shields.io/bundlephobia/min/dom-proxy)](https://bundlephobia.com/package/dom-proxy)
[![Minified and Gzipped Package Size](https://img.shields.io/bundlephobia/minzip/dom-proxy)](https://bundlephobia.com/package/dom-proxy)

Demo: https://dom-proxy.surge.sh

## Quick Example

```typescript
// elements type are inferred from selector
let { password, showPw } = queryElementProxies({
  showPw: 'input#show-pw',
  password: '[name=password]',
})

watch(() => {
  password.type = showPw.checked ? 'text' : 'password'
})

let nameInput = input({ placeholder: 'guest', id: 'visitor-name' })
let nameText = text()

// auto re-run when the value in changed
watch(() => {
  nameText.textContent = nameInput.value || nameInput.placeholder
})

document.body.appendChild(
  fragment([
    label({ textContent: 'name: ', htmlFor: nameInput.id }),
    nameInput,
    p({}, ['hello, ', nameText]),
  ]),
)
```

Complete example see [quick-example.ts](./demo/quick-example.ts)

(Explained in the [usage examples](#usage-examples) section)

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

Or import from javascript as commonjs module:

```javascript
var domProxy = require('dom-proxy')
```

You can also get dom-proxy directly in html via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/dom-proxy@2/browser.min.js"></script>
<script>
  console.log(typeof domProxy.watch) // function
</script>
```

## Usage Examples

More examples can be found in [./demo](./demo):

- [index.ts](./demo/index.ts)
- [signup.ts](./demo/signup.ts)
- [hybrid.html](./demo/hybrid.html) + [hybrid.ts](./demo/hybrid.ts)
- [style.html](./demo/style.html) + [style.ts](./demo/style.ts)

### Example using creation functions

This example consists of a input and text message.

With the `watch()` function, the text message is initialied and updated according to the input value. We don't need to specify the dependency explicitly.

```typescript
import { watch, input, span, label, fragment } from 'dom-proxy'

let nameInput = input({ placeholder: 'guest', id: 'visitor-name' })
let nameSpan = span()

// the read-dependencies are tracked automatically
watch(() => {
  nameSpan.textContent = nameInput.value || nameInput.placeholder
})

document.body.appendChild(
  // use a DocumentFragment to contain the elements
  fragment([
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

let loginForm = queryElement('form#loginForm') // infer to be HTMLFormElement
let { password, showPw } = queryElementProxies(
  {
    showPw: 'input#show-pw', // infer to be ProxyNode<HTMLInputElement> <- "input" tagName
    password: '[name=password]', // fallback to be ProxyNode<HTMLInputElement> <- "[name=.*]" attribute without tagName
  },
  loginForm,
)

watch(() => {
  password.type = showPw.checked ? 'text' : 'password'
})
```

## Typescript Signature

The types shown in this section are simplified, see the `.d.ts` files published in the npm package for complete types.

### Reactive function

```typescript
/** @description run once immediately, auto track dependency and re-run */
function watch(
  fn: Function,
  options?: {
    listen?: 'change' | 'input' // default 'input'
  },
): void
```

### Selector functions

These query selector functions will throw error if no elements match the selectors.

The corresponding element type is inferred from the tag name in the selector. (e.g. `select[name=theme]` will be inferred as `HTMLSelectElement`)

If the selector doesn't contain the tag name but containing "name" attribute (e.g. `[name=password]`), the inferred type will be `HTMLInputElement`.

If the element type cannot be determined, it will fallback to `Element` type.

```typescript
function queryElement<Selector extends string>(
  selector: Selector,
  parent?: ParentNode,
): InferElement<Selector>

function queryElementProxy<Selector extends string>(
  selector: Selector,
  parent?: ParentNode,
): ProxyNode<InferElement<Selector>>

function queryElements<SelectorDict extends Dict<string>>(
  selectors: SelectorDict,
  parent?: ParentNode,
): { [P in keyof SelectorDict]: InferElement<SelectorDict[P]> }

function queryElementProxies<SelectorDict extends Dict<string>>(
  selectors: SelectorDict,
  parent?: ParentNode,
): { [P in keyof SelectorDict]: ProxyNode<InferElement<SelectorDict[P]>> }
```

### Creation functions

```typescript
function fragment(nodes: NodeChild[]): DocumentFragment

/** @alias t, text */
function createText(value?: string | number): ProxyNode<Text>

/** @alias h, html */
function createHTMLElement<K, Element>(
  tagName: K,
  props?: Properties<Element>,
  children?: NodeChild[],
): ProxyNode<Element>

/** @alias s, svg */
function createSVGElement<K, SVGElement>(
  tagName: K,
  props?: Properties<SVGElement>,
  children?: NodeChild[],
): ProxyNode<SVGElement>

function createProxy<Node>(node: Node): ProxyNode<Node>
```

### Creation helper functions

The creation function of most html elements and svg elements are defined as partially applied `createHTMLElement()` or `createSVGElement()`.

If you need more helper functions (e.g. for custom web components or deprecated elements[1]), you can defined them with `genCreateHTMLElement(tagName)` or `genCreateSVGElement(tagName)`

The type of creation functions are inferred from the tag name with `HTMLElementTagNameMap` and `SVGElementTagNameMap`.

Below are some example types:

```typescript
// some pre-defined creation helper functions
const div: PartialCreateElement<HTMLDivElement>,
  p: PartialCreateElement<HTMLParagraphElement>,
  a: PartialCreateElement<HTMLAnchorElement>,
  label: PartialCreateElement<HTMLLabelElement>,
  input: PartialCreateElement<HTMLInputElement>,
  path: PartialCreateElement<SVGPathElement>,
  polyline: PartialCreateElement<SVGPolylineElement>,
  rect: PartialCreateElement<SVGRectElement>
// and more ...
```

For most elements, the creation functions use the same name as the tag name, however some are renamed to avoid name clash.

Renamed html element creation functions:

- `html` -> `htmlElement`
- `s` -> `sElement`
- `script` -> `scriptElement`
- `style` -> `styleElement`
- `title` -> `titleElement`
- `var` -> `varElement`

Renamed svg elements creation functions:

- `a` -> `aSVG`
- `script` -> `scriptSVG`
- `style` -> `styleSVG`
- `svg` -> `svgSVG`
- `switch` -> `switchSVG`
- `text` -> `textSVG`
- `title` -> `titleSVG`

<details>
<summary>
Tips to rename the creation functions (click to expand)
</summary>

The creation functions are defined dynamically in the proxy object `createHTMLElementFunctions` and `createSVGElementFunctions`

If you prefer to rename them with different naming conventions, you can destruct from the proxy object using your preferred name. For example:

```typescript
const { s, style, var_ } = createHTMLElementFunctions
const { a, text } = createSVGElementFunctions
const {
  html: { a: html_a, style: htmlStyle },
  svg: { a: svg_a, style: svgStyle },
} = createElementFunctions
```

You can also use them without renaming, e.g.:

```typescript
const h = createHTMLElementFunctions

let style = document.body.appendChild(
  fragment([
    // you can use the creation functions without extracting into top-level const
    h.s({ textContent: 'Now on sales' }),
    'Sold out',
  ]),
)
```

The types of the proxies are listed below:

```typescript
type CreateHTMLElementFunctions = {
  [K in keyof HTMLElementTagNameMap]: PartialCreateElement<
    HTMLElementTagNameMap[K]
  >
}
const createHTMLElementFunctions: CreateHTMLElementFunctions

type CreateSVGElementFunctions = {
  [K in keyof SVGElementTagNameMap]: PartialCreateElement<
    SVGElementTagNameMap[K]
  >
}
const createSVGElementFunctions: CreateSVGElementFunctions

const createElementFunctions: {
  html: CreateHTMLElementFunctions
  svg: CreateSVGElementFunctions
}
```

</details>

<br>

[1]: Some elements are deprecated in html5, e.g. dir, font, frame, frameset, marquee, param. They are not predefined to avoid tsc error in case their type definition are not included.

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

### Options Types / Output Types

```typescript
type ProxyNode<E> = E & {
  node: E
}

type NodeChild = Node | ProxyNode | string | number

type Properties<E> = Partial<{
  [P in keyof E]?: E[P] extends object ? Partial<E[P]> : E[P]
}>

type PartialCreateElement<Element> = (
  props?: Properties<Element>,
  children?: NodeChild[],
) => ProxyNode<Element>
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
