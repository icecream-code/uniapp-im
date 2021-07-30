<template>
	<view class="btn-group">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: 'btn-group',
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-group {
		&::v-deep button {
			height: 92rpx;
			line-height: 92rpx;
			margin: 0;
			padding: 0;
			background-color: #fff;
			border-radius: 0;
			font-size: 32rpx;
			color: $uni-text-color;
			
			&::after {
				border: none;
				border-radius: 0;
			}
			
			&:not(:last-child)::after {
				border-bottom: .5px solid $uni-border-color;
			}
			
			&[type=primary] {
				color: $uni-color-primary;
			}
			
			&[type=warn] {
				color: $uni-color-error;
			}
		}
	}
</style>
