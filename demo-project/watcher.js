import {Dep} from "./dep.js"
import {renderComponent} from './diff.js'
import b from 'b';

export class Watcher {
  constructor(vm) {
    this.vm = vm
    this.vnode = vm.render()
    this.get()
    this.update = this.update.bind(this)

  }

  get() {
    Dep.target = this
  }

  update() {
    console.log('111')
    renderComponent(this.vm, this.vnode)
  }
}