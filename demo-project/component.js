import { enqueueSetState } from './set-state-queue.js'
import { Watcher } from './watcher.js';
import { Observer } from './observer.js';

export class Component {
  constructor(props = {}) {
    this.isReactComponent = true

    this.state = {}
    this.props = props
  }

  willMount(){
    new Observer(this.state)
    new Watcher(this)
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this)
  }
}

export default Component
