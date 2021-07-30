<template>
	<view class="more-wrapper">
		<view class="more__row">
			<template v-for="item in list">
				<view :key="item.icon" class="more__row-item">
					<span :class="['iconfont', item.icon]" />
					<span>{{ item.label }}</span>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'msg-more',
		data() {
			return {
				list: [
					{ icon: 'icon-image-fill', label: '图片'},
					{ icon: 'icon-paishexuanzhong', label: '拍摄'},
					{ icon: 'icon-shipin', label: '视频通话'},
					{ icon: 'icon-weizhi', label: '位置'},
					{ icon: 'icon-chunjie-hongbao', label: '红包'},
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.more-wrapper {
		border-top: .5px solid $uni-border-color;
		
		.more__row {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			
			&-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 18rpx 0;
				font-size: $uni-font-size-sm;
			}
		}
		
		.iconfont {
			margin-bottom: 8rpx;
			padding: 32rpx;
			font-size: 60rpx;
			border-radius: $uni-border-radius-lg;
			background-color: #fff;
		}
	}
</style>
