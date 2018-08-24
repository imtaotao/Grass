import version from './version'

export function isVNode (x) {
  return x && x.type === "VirtualNode" && x.version === version
}

export function isVText (x) {
  return x && x.type === "VirtualText" && x.version === version
}

export function isWidget (w) {
  return w && w.type === "Widget"
}
