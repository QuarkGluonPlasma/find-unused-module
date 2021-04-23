import { diff } from './diff.js'

function render(vnode, container, node) {
  return diff(node, vnode, container)
}

export default render
