import Grass from './src'
import Root from './demo'

Grass.directive('taotao', (component, dom, val) => {
  console.log(val);
  // dom.onclick = e => {
  //   component.setState({h: 121})
  // }
  // console.log(component, dom, val);
})

Grass.directive('tt', (component, dom, val) => {
  // console.log(component, dom, val);
})

Grass.event(Root)

Grass.mount(
  document.getElementById('root'),
  Root
).then(dom => console.log('程序初始化完成'))

Root
.on((val) => {
  console.log('on : ', val);
})
.once(val => {
  console.log('once : ', val);
})
.done(val => {
  console.log('done : ', val);
})
.error(err => console.log(err))