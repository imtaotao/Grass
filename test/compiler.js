import * as _ from '../utils'
import { createAst } from '../compiler'

export function compilerText () {
	const htmlStr = `
<template v-if=''>
	<div>
		<div id='dd'>
			<a></a>dd
		</div>
		<div class="right-box rt animate">
			<go-up class='go-top' v-show='showGoUp'></go-up>
			<!-- tab 栏 -->
			<nav>
				<nav-com></nav-com>
				<div class="border-bottom"></div>
			</nav>
			<transition :name="transition" mode="out-in">
				<router-view 
				class="right-content-details" 
				v-scrollTop='scroll'>
				</router-view>
			</transition>
		</div>
	</div>
</template>
	`

	createAst(htmlStr)
}