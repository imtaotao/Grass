import * as _ from '../utils'
import { createAst } from '../compiler'

export function compilerText () {
	const htmlStr = `
<template id=taotao>
	<div>
		<!-- 总体容器 -->
		<transition name='long-fade' v-for='12'>
			<div class="all-container animate-five" v-if='showContainer'>
				<loading v-if='isLoading'></loading>
				<transition name='zoom'>
					<div class="mainpage-box" v-if='!songDetail'>
						<div class="bg-pic animate" :style='{background: bgStyle()}'></div>
						<!-- 左边栏 -->
						<aside class="lf" id="js_aside">
							<!-- 个人登录信息 -->
							<div class="sigle-tab-box user-info">
								<p class="tab-title">个人信息</p>
								<div class="person-info">
									<div class="pic-box">
										<input 
										type="file" 
										class="hide-input" 
										title="上传个人头像"
										id='upPic'
										@change='upPic'/>
										<div class="border-cicle"></div>
										<img :src="user.pic" width="80" height="80" />
									</div>
									
									<div @click.self='changeNick' class='user-nick'>
										<span title="修改昵称" 
										@click.self='changeNick'>{{user.nickname}}</span>
										<div class='change-nick animate' 
										:class='nickChangeBar ? "" : "hide-bar"'>
											<div class='nick-corners'></div>
											<input type='text' v-model='inputNick' 
											@keyup.enter='submitNick'/>
										</div>
									</div>
									<p class='user-grade'>{{user.grade}}</p>
									<!-- 经验条 -->
									<div class="experience-bar">
				                        <span></span>
				                        <span 
				                        class='animate-os' 
				                        :style='{width: exprocent(user.percent)}'>
				                        	<i class="show-box animate">
				                        		<div class="sharp-corners"></div>
				                        		{{user.ex}}/{{exprocent(user.percent)}}
				                        	</i>
				                        </span>
				                    </div>
								</div>
							</div>
							<!-- 歌单部分 -->
							<div class="list-box">
								<div class="sigle-tab-box" v-for='item in leftLum'>
									<p class="tab-title" v-if='item.title'>{{item.title}}</p>
									<ul>
										<router-link
											:to='key.url' 
											v-for="key in item.content" 
											tag='li'
											class='tab-btn'
											v-show='showColumn(key.name)'
											>
												<i :class='getIcon(item.title, key.name)' 
												v-ripple='"#0094B9"'></i>
												<span>{{key.name}}</span>

												<!-- 下载 -->
												<span 
												class='down-icon rt animate-os'
												v-if='key.name === "下载音乐"'
												:class='showDown ? "show-down" : ""'>
												+ {{downlength}}
												</span>
											</router-link>
									</ul>
								</div>

								<!-- 歌单列表 -->
								<div class="sigle-tab-box">
									<p class="tab-title">收藏的歌单</p>
									<ul>
										<router-link
											:to='"/collectList/" + key.id' 
											v-for='key in user.collectList'
											tag='li'
											class='tab-btn'
											>
												<i class='musicList' v-ripple='"#0094B9"'></i>
												<span 
												class='hidden-text list-name' 
												:title='key.listName'>
													{{key.listName}}
												</span>
											</router-link>
									</ul>
								</div>
							</div>
						</aside>
						<!-- 右边栏 -->
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
				</transition>
				<!-- 当前播放歌曲详情 -->
				<transition name='zoom'>
					<songDetail 
					v-if='songDetail' 
					class='song-detail' 
					:songDetail.sync='songDetail'></songDetail>
				</transition>

				<!-- 登录窗口 -->
				<login-box class='login-box'></login-box>
			</div>

			<visualizer v-if='!showContainer'></visualizer>
		</transition>
	</div>
</template>
	`

	createAst(htmlStr)
}