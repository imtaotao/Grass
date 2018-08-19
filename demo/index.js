import Grass from '../src'
import Dir from './directory'
import CreateState from './createState'
import Directive from './directive'
import EventDone from './event-done'
import EventError from './event-error'
import EventNext from './event-next'
import SetState from './setState'
import Event from './event'
import Comp from './component';
import Mount from './mount'
import './style.css'

class Root extends Grass.Component {
  constructor () {
    super()
    this.state = {
      api: 'directive',
    }
  }

  createBefore () {
    window.s = this
    Dir.on(api => {
      this.setState({ api })
    })
  }

  template () {
    return `
      <div className="container">
        <p className="header-bar"></p>
        <Dir className="left" :currentApi="api"/>

        <div className="right">
          <Comp v-if="api === 'Component'"/>
          <Mount v-if="api === 'mount'"/>
          <CreateState v-if="api === 'createState'" />
          <Directive v-if="api === 'directive'" />
          <EventDone v-if="api === 'done'" />
          <EventError v-if="api === 'error'" />
          <EventNext v-if="api === 'next'" />
          <SetState v-if="api === 'setState'" />
          <Event v-if="api === 'event'" />
        </div>
      </div>
    `
  }

  component () {
    return {
      Dir,
      Comp,
      Mount,
      CreateState,
      Directive,
      EventDone,
      EventError,
      EventNext,
      SetState,
      Event,
    }
  }
}

Grass.mount(document.getElementById('root'), Root)