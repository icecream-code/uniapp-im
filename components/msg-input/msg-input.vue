<template>
	<view class="input-wrapper">
		<view class="input__main">
			<!-- 语音 -->
			<view>
				<span v-if="inputType !== 2" class="iconfont icon-yuyin1" @click="toVoiceInput" />
				<span v-else class="iconfont icon-keyboard" @click="toTextInput" />
			</view>
			<!-- input -->
			<input
				v-model="inputValue"
				:focus="inputFocus"
				class="input"
				type="text"
				confirm-type="send"
				hold-keyboard
				:adjust-position="false"
				@focus="handleFocus"
				@confirm="send"
				@keyboardheightchange="handleKeyboardheightchange"
			>
			<!-- 表情 -->
			<view>
				<span v-if="inputType !== 1" class="iconfont icon-biaoqing" @click="toEmojiInput" />
				<span v-else class="iconfont icon-keyboard" @click="toTextInput" />
			</view>
			<!-- 更多 -->
			<view>
				<span class="iconfont icon-add" @click="toMoreInput" />
			</view>
		</view>
		<view class="input__content">
			<!-- 表情 -->
			<view v-show="inputType == 1" class="input__content-emoji">
				<!-- 表情内容 -->
				<emoji @on-select="handleEmojiSelect" />
				<!-- 退格与发送 -->
				<view class="input-btn">
					<view class="btn-ops">
						<button size="mini" :disabled="!inputValue" @click="backspace">
							<span class="iconfont icon-qingchu" />
						</button>
						<button size="mini" :disabled="!inputValue" @click="send">发送</button>
					</view>
				</view>
			</view>
			
			<!-- 更多 -->
			<view v-show="inputType == 3" class="msg__content-more">
				<msg-more />
			</view>
		</view>
	</view>
</template>

<script>
	import Emoji from '../emoji/emoji.vue'
	import MsgMore from '../msg-more/msg-more.vue'
	
	export default {
		name: 'msg-input',
		emits: ['send', 'height-change'],
		components: {
			Emoji,
			MsgMore
		},
		data() {
			return {
				inputValue: '',
				inputType: 0, // 0文本 1表情 2语音 3更多
				inputFocus: false
			}
		},
		watch: {
			inputType(val) {
				this.inputFocus = val === 0
				this.emitHeightChange(0)
			}
		},
		methods: {
			toTextInput() {
				this.inputType = 0
			},
			toEmojiInput() {
				this.inputType = 1
			},
			toVoiceInput() {
				this.inputType = 2
			},
			toMoreInput() {
				const inputType = this.inputType
				if (inputType != 3) {
					this.inputType = 3
				} else {
					this.toTextInput()
				}
			},
			handleFocus(e) {
				console.log(e)
				this.toTextInput()
			},
			handleEmojiSelect(emoji) {
				this.inputValue += emoji
			},
			backspace() {
				const inputValue = this.inputValue
				if (inputValue.length) {
					this.inputValue = inputValue.substr(0, inputValue.length - 1)
				}
			},
			send() {
				const inputType = this.inputType
				let type = 0
				
				if (inputType === 0 || inputType === 1) { // 文本、表情
					type = 0
				} else if (inputType === 2) { // 语音
					type = 2
				} else {
					
				}
				
				this.$emit('send', { type, content: this.inputValue })
				this.inputValue = ''
			},
			handleKeyboardheightchange(e) {
				// 键盘过渡时间
				const duration = e.detail.duration * 1000 * 2 + 100
				setTimeout(() => {
					this.emitHeightChange(e.detail.height)
				}, duration)
			},
			// 高度改变（含键盘）
			emitHeightChange(delta) {
				this.$nextTick(() => {
					const view = uni.createSelectorQuery().in(this).select(".input-wrapper")
					view.boundingClientRect(data => {
						this.$emit('height-change', delta + data.height)
					}).exec()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-wrapper {
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: $uni-bg-color-grey;
		border-top: .5px solid $uni-border-color;
		
		.input__main {
			display: flex;
			align-items: center;
			padding: 16rpx 0;
			height: 74rpx;
			
			.iconfont {
				margin: 0 14rpx;
				font-size: 52rpx;
			}
			
			.input {
				flex: 1;
				height: 100%;
				padding-left: 16rpx;
				padding-right: 16rpx;
				border-radius: $uni-border-radius-base;
				caret-color: $uni-color-success;
				font-size: $uni-font-size-base;
				background-color: #fff;
			}
		}
		
		.input__content {
			.input__content-emoji {
				position: relative;
				height: 440rpx;
				overflow: hidden;
				overflow-y: auto;
				
				.input-btn {
					height: 98rpx;
					
					.btn-ops {
						display: flex;
						align-items: center;
						position: fixed;
						right: 0;
						bottom: 0;
						bottom: constant(safe-area-inset-bottom);
						bottom: env(safe-area-inset-bottom);
						padding: 16rpx;
						background-color: $uni-bg-color-grey;
						
						button {
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 16rpx;
							width: 88rpx;
							height: 70rpx;
							padding: 0;
							background-color: #fff;
							
							&::after {
								border: none;
							}
						}
					}
				}
			}
		}
	}
</style>
