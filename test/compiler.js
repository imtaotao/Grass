import * as _ from '../utils'
import { createComponent } from '../compiler'

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
			<div :style="{width: 10 + 'px', height: this.height(a)}" style="float: left; ">
				<div v-for="(val, i) of num" name="tt" class="121">
					<span v-text="val">{{val}}, {{i}}</span>
				</div>
			</div>
		</template>
	`

	const componentConfig = createComponent({
		data: {
			a: 3,
			style: {float: 'left'},
			num: ['tt', 'ff', 'cc']
		},
		height (arg) {
			return '30px'
		},
		template: htmlStr,
		component: {}
	})
}