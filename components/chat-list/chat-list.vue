<template>
	<view class="chat-list">
		<view
			v-for="(value, index) in list"
			class="chat-item"
			@click="handleClick(value, index)"
		>
			<view class="chat-left">
				<image class="avatar" :src="value.avatar" />
				<view class="unread">
					<uni-badge :text="value.unread" size="small" type="error" />
				</view>
			</view>
			<view class="chat-right">
				<view class="chat-right-t">
					<view class="name">{{ value.markName }}</view>
					<view class="time">{{ value.time }}</view>
				</view>
				<view class="chat-right-b">{{ value.content }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
			}
		},
		methods: {
			handleClick(item, index) {
				this.$emit('on-chat-item-click', item, index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/scss/mixins.scss";
	
	.chat-item {
		display: flex;
		padding-top: 16rpx;
		
		// &:last-child .chat-right {
		//    border-bottom: none;
		// }
		
		.chat-left {
			position: relative;
			width: 138rpx;
			text-align: center;
			
			.avatar {
				width: 92rpx;
				height: 92rpx;
				border-radius: $uni-border-radius-base;
			}
			
			.unread {
				position: absolute;
				top: -16rpx;
				right: 0;
			}
		}
		
		.chat-right {
			position: relative;
			flex: 1;
			overflow: hidden;
			padding-right: 16rpx;
			// border-bottom: 1px solid $uni-border-color;
			
			.chat-right-t {
				display: flex;
				justify-content: space-between;
				line-height: 50rpx;
				
				.name {
					flex: 1;
					font-size: 36rpx;
					font-weight: 400;
					color: $uni-text-color;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.time {
					font-size: $uni-font-size-sm;
					text-align: right;
					color: $uni-text-color-disable;
				}
			}
			
			.chat-right-b {
				padding-bottom: 16rpx;
				font-size: $uni-font-size-base;
				line-height: 40rpx;
				color: $uni-text-color-disable;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		
		&:not(:last-child) .chat-right {
			&::after {
				@include bdr-1px(bottom);
			}
		}
	}
</style>
