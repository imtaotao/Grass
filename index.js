import Grass from './src'
import Root from './demo'

Grass.directive('taotao', (component, dom, val) => {
  console.log(component, dom, val);
})

Grass.directive('tt', (component, dom, val) => {
  console.log(component, dom, val);
})

console.time('t')
Grass.mount(
  document.getElementById('root'),
  Root
).then(dom => console.log('程序初始化完成'))
console.timeEnd('t');