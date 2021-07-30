<template>
	<view class="list-item" @tap="handleTap">
		<view class="list-item__thumb" v-if="thumb !== undefined && thumb !== null">
			<image class="image" :src="thumb" mode="widthFix" />
		</view>
		<view class="list-item__content">
			<list-line :link="link">
				<slot></slot>
				<template slot="extra">
					<slot name="extra"></slot>
				</template>
			</list-line>
		</view>
	</view>
</template>

<script>
	import ListLine from './list-line.vue'
	
	export default {
		name: 'list-item',
		emits: ['on-tap'],
		props: {
			thumb: {
				type: String,
				default: null
			},
			link: {
				type: Boolean,
				default: false
			},
			to: {
				type: String,
				required: false
			}
		},
		components: {
			ListLine
		},
		methods: {
			handleTap() {
				this.to && uni.navigateTo({ url: this.to })
				this.$emit('on-tap')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-item {
		display: flex;
		align-items: center;
		padding-left: 28rpx;
		min-height: 90rpx;
		vertical-align: middle;
		overflow: hidden;
		background-color: #fff;
		
		&__thumb {
			.image {
				margin-right: 28rpx;
				width: 60rpx;
				height: 60rpx;
				vertical-align: middle;
				border-radius: $uni-border-radius-base;
			}
		}
		
		&__content {
			position: relative;
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
