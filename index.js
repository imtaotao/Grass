// import { createComponent, mount } from './src'
import component from './src'
import Root from './demo'

// // const htmlStr = `
// // 	<template>
// // 		<div v-show='this.data' v-for="(val, j) of this.data.num" v-if='121'>
// // 			{{121}}
// // 			<div id='dd'>
// // 				<a></a>dd
// // 			</div>
// // 			<div class="right-box rt animate">
// // 				<!-- tab 栏 -->
// // 				<nav>
// // 					<nav-com></nav-com>
// // 					<div class="border-bottom"></div>
// // 				</nav>
// // 				<div v-for='(val, i) of data'>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	</template>
// // `

// function chentao () {
//   const html = `
//     <div>{{ff}}</div>
//   `

//   return createComponent({
//     state: {
//       ff: 'fangfang'
//     },
//     template: html
//   })
// }

// function customize () {
//   const html = `
//     <template id='cus'>
//       <div v-for="val of ns" v-show="ns > 1">
//         <chentao />
//         <span @click="this.e.bind(this)">{{val}}</span>
//       </div>
//     </template>
//   `

//   return createComponent({
//     state: {
//       ns: [11, 22, 33]
//     },
//     e () {
//       console.log(11);
//       this.setState({ns: [0, 22, 33]})
//       setTimeout(() => {
//         this.setState({ns: [11, 22, 33]})
//       }, 2000)
//     },
//     component: {
//       chentao: chentao()
//     },
//     template: html
//   })
// }

// const htmlStr = `
//   <template>
//     <div v-show="show" :style="{height: '20px', marginRight: '20px'}" :id='a'>
//       <span id='ttt'>
//       </span>
//       <div v-for="(val, i) of num" name="tt" :className="\`\${a}121\`">
//         <span @click="this.click.bind(this, val)" @mousedown="this.height">
//           {{val}} -- {{ this.tt(i) }}
//         </span>
//         <br />
//       </div>
//     </div>
//   </template>
// `

// const component = createComponent({
//   state: {
//     show: true,
//     a: 3,
//     style: {float: 'left'},
//     num: ['tt', 'ff', 'cc'],
//   },
//   height (arg) {
//     return '30px'
//   },
//   click (val) {
//     this.setState({ a: 1, show: false })

//     setTimeout(() => {
//       this.setState({ a: 4, show: true })
//     }, 2000);
//   },
//   tt (arg) {
//     return arg + 1 + '.1'
//   },
//   aa (res) {
//     console.log(res);
//   },
//   // template: htmlStr,
//   component: {
//     // customize: customize(),
//   }
// })

// mount(document.getElementById('root'), component)


// class tt extends component {
//   constructor () {
//     super()
//     this.state = {
//       show: true,
//       a: [1, 2]
//     }
//   }

//   c (val) {
//     this.setState({ show: false })

//     setTimeout(() => {
//       this.setState({ show: true })
//     }, 3000)
//   }

//   template () {
//     return `<div v-for="val of a" v-show="show">
//       <div @click="this.c.bind(this, val)"> {{ val }} </div>
//     </div>`
//   }
// }

// var str = 
// `<template>
//   <div v-show="show" :style="{height: '20px', marginRight: height + 'px'}" :id='a'>
//     <tt />
//     <div v-for="(val, i) of num" name="tt" :className="\`\${a}121\`">
//       <span @click="this.click.bind(this, val)" @mousedown="this.height">
//         {{val}} -- {{ this.tt(i) }}
//       </span>
//       <br />
//     </div>
//   </div>
// </template>`

// class Root extends component {
//   constructor () {
//     super()
//     this.state = {
//       a: 1,
//       show: true,
//       num: [1],
//       height: 20
//     }
//   }

//   tt (i) {
//     return i * 2
//   }

//   click(val) {
//     console.log(val);
//     this.setState({ height: 10 })
//   }

//   template () {
//     return str
//   }

//   get component () {
//     return [tt]
//   }
// }


component.mount(document.getElementById('root'), Root)
// .then(dom => console.log(dom))