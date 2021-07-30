<template>
	<view class="list-line">
		<view class="list-line__content">
			<slot></slot>
		</view>
		<view class="list-line__extra">
			<slot name="extra"></slot>
		</view>
		<view class="list-line__arrow" v-if="link">
			<span class="iconfont icon-arrow-right" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'list-line',
		props: {
			link: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-line {
		display: flex;
		flex: 1;
		align-items: center;
		padding-right: 28rpx;
		min-height: 92rpx;
		overflow: hidden;
		background-color: #fff;
		
		&__content,
		&__extra,
		&__arrow {
			display: flex;
			align-items: center;
			line-height: 1.5;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		&__content {
			flex: 1;
			justify-content: flex-start;
			font-size: 32rpx;
		}
		
		&__extra {
			justify-content: flex-end;
			text-align: right;
			color: $uni-text-color-grey;
		}
		
		&__arrow {
			padding-left: 16rpx;
			.icon-arrow-right {
				color: $uni-text-color-disable;
			}
		}
	}
</style>
