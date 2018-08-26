<template>
  <div styleName="container">
    <p styleName="header-bar"></p>
    <Dir styleName="left" :currentApi="api"/>

    <div styleName="right">
      <Comp v-if="api === 'Component'"/>
      <Mount v-if="api === 'mount'"/>
      <CreateState v-if="api === 'createState'" />
      <Directive v-if="api === 'directive'"/>
      <EventDone v-if="api === 'done'" />
      <EventError v-if="api === 'error'" />
      <EventNext v-if="api === 'next'" />
      <SetState v-if="api === 'setState'" />
      <Event v-if="api === 'event'" />
    </div>
  </div>
</template>

<script>
  import Grass, { CSSModules } from '../../src'
  import Dir from '../directory'
  import CreateState from '../createState'
  import Directive from '../directive'
  import EventDone from '../event-done'
  import EventError from '../event-error'
  import EventNext from '../event-next'
  import SetState from '../setState'
  import Event from '../event'
  import Comp from '../component';
  import Mount from '../mount'
  import style from './style.css'

  @CSSModules(style)
  class Root extends Grass.Component {
    constructor () {
      super()
      this.state = {
        api: 'directive',
      }
    }

    createBefore () {
      Dir.on(api => {
        console.log(api);
        this.setState({ api })
      })
    }

    click () {
      this.setState({ api : 'xxxx'})
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
</script>