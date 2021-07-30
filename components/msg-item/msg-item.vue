<template>
	<view class="msg-item">
		<!-- 时间 -->
		<view v-if="message.isShowTime" class="time">
			<text>{{ formatTime(message.createTime) }}</text>
		</view>
		
		<!-- 消息 -->
		<view :class="['chat', avatarRight ? 'right' : 'left']">
			<!-- 头像 -->
			<image
				:src="message.avatar"
				class="chat__avatar"
				@tap="handleAvatarTap(message)"
			/>
			<!-- 文本 -->
			<view
				v-if="message.type === 0"
				class="chat__content-text"
				@tap="handleMessageTap(message)"
			>
				<view class="content-msg">{{ message.content }}</view>
				<view class="content-arrow" />
			</view>
			<!-- 图片 -->
			<image
				v-if="message.type === 1"
				:src="message.content"
				class="chat__content-img"
				mode="widthFix"
				@tap="handleMessageTap(message)"
			/>
		</view>
	</view>
</template>

<script>
	import { showTimePipe } from '@/utils/common.js'
	
	export default {
		name: 'msg-item',
		props: {
			message: {
				type: Object,
				required: true
			},
			avatarRight: {
				type: Boolean,
			}
		},
		emits: ['avatar-tap', 'message-tap'],
		data() {
			return {
				
			}
		},
		methods: {
			formatTime(time) {
				return showTimePipe(time)
			},
			handleAvatarTap(message) {
				this.$emit('avatar-tap', message)
			},
			handleMessageTap(message) {
				this.$emit('message-tap', message)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.msg-item {
		.chat {
			display: flex;
			flex-direction: row; // IOS
			padding: 18rpx 0;
			box-sizing: border-box;
		
			&__avatar {
				width: 76rpx;
				height: 76rpx;
				margin: 0 20rpx;
				border-radius: $uni-border-radius-base;
			}
		
			&__content-text {
				max-width: calc(100% - 224rpx);
				position: relative;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-success;
		
				.content-msg {
					padding: 16rpx 20rpx;
					word-wrap: break-word;
					word-break: normal;
				}
		
				.content-arrow {
					transform: rotate(45deg);
					position: absolute;
					top: 28rpx;
					width: 14rpx;
					height: 14rpx;
					background-color: $uni-color-success;
				}
			}
		
			&__content-img {
				max-width: 280rpx;
				border-radius: $uni-border-radius-base;
			}
		
			&.left {
				.chat__content-text {
					background-color: #fff;
				}
		
				.content-arrow {
					left: -7rpx;
					background-color: #fff;
				}
			}
		
			&.right {
				flex-direction: row-reverse;
		
				.content-arrow {
					right: -7rpx;
				}
			}
		}
		
		.time {
			text-align: center;
			font-size: $uni-font-size-sm;
			color: $uni-color-paragraph;
		}
	}
</style>
