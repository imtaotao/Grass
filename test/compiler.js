import * as _ from '../utils'
import { createComponent, mount } from '../compiler'

export function compilerText () {
	// const htmlStr = `
	// 	<template>
	// 		<div v-show='this.data' v-for="(val, j) of this.data.num" v-if='121'>
	// 			{{121}}
	// 			<div id='dd'>
	// 				<a></a>dd
	// 			</div>
	// 			<div class="right-box rt animate">
	// 				<!-- tab 栏 -->
	// 				<nav>
	// 					<nav-com></nav-com>
	// 					<div class="border-bottom"></div>
	// 				</nav>
	// 				<div v-for='(val, i) of data'>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</template>
	// `

	const htmlStr = `
		<template>
			<div v-if="a > 2" id='test'>
				<span> {{a}} </span>
				<Customize />
				<div v-for="(val, i) of num" name="tt" class="121">
					<span @click="this.click.bind(this, val)">
						{{val}} -- {{ this.tt(i) }} <span>{{this.height()}}</span>
					</span>
					<br />
				</div>
			</div>
		</template>
	`

	const component = createComponent({
		state: {
			a: 3,
			style: {float: 'left'},
			num: ['tt', 'ff', 'cc', 1, 2, 3]
		},
		height (arg) {
			return '30px'
		},
		click (val) {
			console.log(val);
			this.setState({ a: 1 })

			setTimeout(() => {
				this.setState({ a: 4 })
			}, 5000);
		},
		tt (arg) {
			return arg * 2
		},
		template: htmlStr,
		component: {}
	})

	mount(document.getElementById('root'), component)
}