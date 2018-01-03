import * as _ from '../utils'
import { parseHtml } from '../compiler'

const testHtml = `
	<div class="song-head">
    <img :src='nowInfo.url' width="60" height="60">
    <div class="bullet-box" @click='enlargeDetail'>
        <img src="static/pageimg/enlarge.png" width="50" height="50">
    </div>
	</div>
`

export function compilerTest() {
  parseHtml(testHtml.trim())
}
