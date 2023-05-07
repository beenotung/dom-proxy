import {
  genCreateHTMLElement,
  genCreateSVGElement,
  PartialCreateElement,
} from './core'

type CreateHTMLElementFunctions = {
  [K in keyof HTMLElementTagNameMap]: PartialCreateElement<
    HTMLElementTagNameMap[K]
  >
}

export const createHTMLElementFunctions = new Proxy(
  {} as CreateHTMLElementFunctions,
  {
    get(target, p: keyof HTMLElementTagNameMap, receiver) {
      return genCreateHTMLElement(p)
    },
  },
)

type CreateSVGElementFunctions = {
  [K in keyof SVGElementTagNameMap]: PartialCreateElement<
    SVGElementTagNameMap[K]
  >
}

export const createSVGElementFunctions = new Proxy(
  {} as CreateSVGElementFunctions,
  {
    get(target, p: keyof SVGElementTagNameMap, receiver) {
      return genCreateSVGElement(p)
    },
  },
)

export const createElementFunctions = {
  html: createHTMLElementFunctions,
  svg: createSVGElementFunctions,
}

export const {
  a,
  abbr,
  address,
  area,
  article,
  aside,
  audio,
  b,
  base,
  bdi,
  bdo,
  blockquote,
  body,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hgroup,
  hr,
  html: htmlElement,
  i,
  iframe,
  img,
  input,
  ins,
  kbd,
  label,
  legend,
  li,
  link,
  main,
  map,
  mark,
  menu,
  meta,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  picture,
  pre,
  progress,
  q,
  rp,
  rt,
  ruby,
  s: sElement,
  samp,
  script: scriptElement,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  style: styleElement,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title: titleElement,
  tr,
  track,
  u,
  ul,
  var: varElement,
  video,
  wbr,
} = createHTMLElementFunctions

export const {
  a: aSVG,
  animate,
  animateMotion,
  animateTransform,
  circle,
  clipPath,
  defs,
  desc,
  ellipse,
  feBlend,
  feColorMatrix,
  feComponentTransfer,
  feComposite,
  feConvolveMatrix,
  feDiffuseLighting,
  feDisplacementMap,
  feDistantLight,
  feDropShadow,
  feFlood,
  feFuncA,
  feFuncB,
  feFuncG,
  feFuncR,
  feGaussianBlur,
  feImage,
  feMerge,
  feMergeNode,
  feMorphology,
  feOffset,
  fePointLight,
  feSpecularLighting,
  feSpotLight,
  feTile,
  feTurbulence,
  filter,
  foreignObject,
  g,
  image,
  line,
  linearGradient,
  marker,
  mask,
  metadata,
  mpath,
  path,
  pattern,
  polygon,
  polyline,
  radialGradient,
  rect,
  script: scriptSVG,
  set,
  stop,
  style: styleSVG,
  svg: svgSVG,
  switch: switchSVG,
  symbol,
  text: textSVG,
  textPath,
  title: titleSVG,
  tspan,
  use,
  view,
} = createSVGElementFunctions
