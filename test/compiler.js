import * as _ from '../utils'
import { createComponent } from '../compiler'

export function compilerText () {
	const htmlStr = `
		<template>
			<div v-show='this.data' v-for="val in data" v-if='121'>
				{{121}}
				<div id='dd'>
					<a></a>dd
				</div>
				<div class="right-box rt animate">
					<!-- tab 栏 -->
					<nav>
						<nav-com></nav-com>
						<div class="border-bottom"></div>
					</nav>
					<div v-for='(val, i) of data'>
					</div>
				</div>
			</div>
		</template>
	`

	const componentConfig = createComponent({
		data: {
			a: 3
		},
		template: htmlStr,
		component: {}
	})
}